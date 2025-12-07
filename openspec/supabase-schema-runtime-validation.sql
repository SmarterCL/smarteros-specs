-- ═══════════════════════════════════════════════════════
-- OPENSPEC RUNTIME VALIDATION - SUPABASE SCHEMA
-- ═══════════════════════════════════════════════════════

-- Tabla principal de scouts por cliente
CREATE TABLE IF NOT EXISTS runtime_scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_rut TEXT NOT NULL,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  critical_urls JSONB NOT NULL,
  expected_keywords JSONB DEFAULT '[]'::jsonb,
  sensitive_keywords JSONB DEFAULT '[]'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_rut, domain)
);

-- Tabla de ejecuciones (snapshots)
CREATE TABLE IF NOT EXISTS runtime_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES runtime_scouts(id) ON DELETE CASCADE,
  execution_time TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  total_urls_checked INTEGER DEFAULT 0,
  links_broken INTEGER DEFAULT 0,
  urls_new INTEGER DEFAULT 0,
  urls_removed INTEGER DEFAULT 0,
  semantic_changes INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  summary TEXT,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de URLs detectadas por ejecución
CREATE TABLE IF NOT EXISTS runtime_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES runtime_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status_code INTEGER,
  redirect_target TEXT,
  is_new BOOLEAN DEFAULT false,
  is_removed BOOLEAN DEFAULT false,
  links_out JSONB DEFAULT '[]'::jsonb,
  content_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de cambios semánticos
CREATE TABLE IF NOT EXISTS runtime_semantic_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES runtime_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('heading', 'button', 'copy', 'price', 'payment_method', 'keyword')),
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  impact_level TEXT DEFAULT 'minor' CHECK (impact_level IN ('minor', 'relevant', 'critical')),
  llm_analysis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de links rotos
CREATE TABLE IF NOT EXISTS runtime_broken_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES runtime_executions(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  broken_url TEXT NOT NULL,
  status_code INTEGER,
  error_type TEXT,
  severity TEXT DEFAULT 'relevant' CHECK (severity IN ('minor', 'relevant', 'critical')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de alertas generadas
CREATE TABLE IF NOT EXISTS runtime_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES runtime_scouts(id) ON DELETE CASCADE,
  execution_id UUID NOT NULL REFERENCES runtime_executions(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'relevant' CHECK (severity IN ('minor', 'relevant', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  affected_urls JSONB DEFAULT '[]'::jsonb,
  sent_at TIMESTAMP,
  sent_via TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_runtime_scouts_tenant ON runtime_scouts(tenant_rut);
CREATE INDEX IF NOT EXISTS idx_runtime_scouts_domain ON runtime_scouts(domain);
CREATE INDEX IF NOT EXISTS idx_runtime_executions_scout ON runtime_executions(scout_id);
CREATE INDEX IF NOT EXISTS idx_runtime_executions_time ON runtime_executions(execution_time DESC);
CREATE INDEX IF NOT EXISTS idx_runtime_urls_execution ON runtime_urls(execution_id);
CREATE INDEX IF NOT EXISTS idx_runtime_urls_url ON runtime_urls(url);
CREATE INDEX IF NOT EXISTS idx_runtime_semantic_execution ON runtime_semantic_changes(execution_id);
CREATE INDEX IF NOT EXISTS idx_runtime_semantic_impact ON runtime_semantic_changes(impact_level);
CREATE INDEX IF NOT EXISTS idx_runtime_broken_execution ON runtime_broken_links(execution_id);
CREATE INDEX IF NOT EXISTS idx_runtime_broken_severity ON runtime_broken_links(severity);
CREATE INDEX IF NOT EXISTS idx_runtime_alerts_scout ON runtime_alerts(scout_id);
CREATE INDEX IF NOT EXISTS idx_runtime_alerts_status ON runtime_alerts(status);

-- Row Level Security (RLS)
ALTER TABLE runtime_scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime_semantic_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime_broken_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE runtime_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad por tenant
CREATE POLICY tenant_isolation_scouts ON runtime_scouts
  FOR ALL USING (tenant_rut = current_setting('app.tenant_rut', true));

CREATE POLICY tenant_isolation_executions ON runtime_executions
  FOR ALL USING (
    scout_id IN (SELECT id FROM runtime_scouts WHERE tenant_rut = current_setting('app.tenant_rut', true))
  );

CREATE POLICY tenant_isolation_urls ON runtime_urls
  FOR ALL USING (
    execution_id IN (
      SELECT e.id FROM runtime_executions e
      JOIN runtime_scouts s ON e.scout_id = s.id
      WHERE s.tenant_rut = current_setting('app.tenant_rut', true)
    )
  );

CREATE POLICY tenant_isolation_semantic ON runtime_semantic_changes
  FOR ALL USING (
    execution_id IN (
      SELECT e.id FROM runtime_executions e
      JOIN runtime_scouts s ON e.scout_id = s.id
      WHERE s.tenant_rut = current_setting('app.tenant_rut', true)
    )
  );

CREATE POLICY tenant_isolation_broken ON runtime_broken_links
  FOR ALL USING (
    execution_id IN (
      SELECT e.id FROM runtime_executions e
      JOIN runtime_scouts s ON e.scout_id = s.id
      WHERE s.tenant_rut = current_setting('app.tenant_rut', true)
    )
  );

CREATE POLICY tenant_isolation_alerts ON runtime_alerts
  FOR ALL USING (
    scout_id IN (SELECT id FROM runtime_scouts WHERE tenant_rut = current_setting('app.tenant_rut', true))
  );

-- Función para limpiar datos antiguos
CREATE OR REPLACE FUNCTION cleanup_old_runtime_data() RETURNS void AS $$
BEGIN
  -- Eliminar snapshots mayores a 90 días
  DELETE FROM runtime_executions 
  WHERE execution_time < NOW() - INTERVAL '90 days';
  
  -- Eliminar alertas mayores a 365 días
  DELETE FROM runtime_alerts 
  WHERE created_at < NOW() - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql;

-- Comentarios
COMMENT ON TABLE runtime_scouts IS 'Scouts configurados por tenant para monitoreo de sitios';
COMMENT ON TABLE runtime_executions IS 'Historial de ejecuciones de scouts con métricas agregadas';
COMMENT ON TABLE runtime_urls IS 'URLs detectadas en cada ejecución con estado HTTP';
COMMENT ON TABLE runtime_semantic_changes IS 'Cambios semánticos detectados por OpenRouter';
COMMENT ON TABLE runtime_broken_links IS 'Links rotos detectados en cada ejecución';
COMMENT ON TABLE runtime_alerts IS 'Alertas generadas y su estado de envío';
