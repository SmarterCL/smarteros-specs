-- ═══════════════════════════════════════════════════════════
-- SMARTEROS v5 - KAGGLE VAULT CONFIGURATION
-- Supabase Vault Setup for Kaggle API Credentials
-- ═══════════════════════════════════════════════════════════

-- 1. Crear esquema vault si no existe
CREATE SCHEMA IF NOT EXISTS vault;

-- 2. Crear tabla credentials
CREATE TABLE IF NOT EXISTS vault.credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  credential_key TEXT NOT NULL,
  credential_value TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_name, credential_key)
);

-- 3. Crear índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_credentials_service 
ON vault.credentials(service_name);

-- 4. Insertar Kaggle credentials
INSERT INTO vault.credentials (service_name, credential_key, credential_value)
VALUES 
  ('kaggle', 'username', 'smarteros'),
  ('kaggle', 'account_number', '32823079'),
  ('kaggle', 'api_token', 'KGAT_91523dd381d26283c4a97316d182a05b')
ON CONFLICT (service_name, credential_key) 
DO UPDATE SET 
  credential_value = EXCLUDED.credential_value,
  updated_at = NOW();

-- 5. Crear función para obtener credential
CREATE OR REPLACE FUNCTION vault.get_credential(
  p_service_name TEXT,
  p_credential_key TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_value TEXT;
BEGIN
  SELECT credential_value INTO v_value
  FROM vault.credentials
  WHERE service_name = p_service_name 
    AND credential_key = p_credential_key;
  
  RETURN v_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Crear función para listar servicios
CREATE OR REPLACE FUNCTION vault.list_services()
RETURNS TABLE(service_name TEXT, credential_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.service_name,
    COUNT(*)::BIGINT
  FROM vault.credentials c
  GROUP BY c.service_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant permissions a SmarterMCP role
GRANT USAGE ON SCHEMA vault TO authenticated;
GRANT SELECT ON vault.credentials TO authenticated;
GRANT EXECUTE ON FUNCTION vault.get_credential TO authenticated;
GRANT EXECUTE ON FUNCTION vault.list_services TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- TEST QUERIES
-- ═══════════════════════════════════════════════════════════

-- Test 1: Obtener Kaggle token
SELECT vault.get_credential('kaggle', 'api_token') AS kaggle_token;

-- Test 2: Listar todos los servicios
SELECT * FROM vault.list_services();

-- Test 3: Obtener todas las credentials de Kaggle
SELECT 
  credential_key,
  vault.get_credential('kaggle', credential_key) AS credential_value
FROM vault.credentials
WHERE service_name = 'kaggle';

-- ═══════════════════════════════════════════════════════════
-- SMARTERMCP INTEGRATION VIEW
-- ═══════════════════════════════════════════════════════════

-- Vista para SmarterMCP
CREATE OR REPLACE VIEW vault.smartermcp_credentials AS
SELECT 
  service_name,
  credential_key,
  CASE 
    WHEN credential_key LIKE '%token%' OR credential_key LIKE '%key%' OR credential_key LIKE '%secret%'
    THEN '***REDACTED***'
    ELSE credential_value
  END AS credential_value,
  created_at
FROM vault.credentials;

-- Grant para SmarterMCP
GRANT SELECT ON vault.smartermcp_credentials TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- AUDIT LOG
-- ═══════════════════════════════════════════════════════════

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS vault.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  service_name TEXT,
  credential_key TEXT,
  user_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Función para loguear acceso
CREATE OR REPLACE FUNCTION vault.log_access(
  p_action TEXT,
  p_service_name TEXT,
  p_credential_key TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO vault.audit_log (action, service_name, credential_key, user_id)
  VALUES (p_action, p_service_name, p_credential_key, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para loguear accesos
CREATE OR REPLACE FUNCTION vault.audit_credentials()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'SELECT' THEN
    PERFORM vault.log_access('SELECT', NEW.service_name, NEW.credential_key);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- COMPLETION MESSAGE
-- ═══════════════════════════════════════════════════════════

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Kaggle Vault Configuration Complete';
  RAISE NOTICE '📊 Services: %', (SELECT COUNT(DISTINCT service_name) FROM vault.credentials);
  RAISE NOTICE '🔑 Credentials: %', (SELECT COUNT(*) FROM vault.credentials);
END $$;
