-- ═══════════════════════════════════════════════════════════════
--  SUPABASE INTEGRATION - SmarterOS v3.0
--  Persistencia de Datos para Smarterprop CL/IT
-- ═══════════════════════════════════════════════════════════════

-- Crear esquemas separados para Chile e Italia
CREATE SCHEMA IF NOT EXISTS cl_prod;
CREATE SCHEMA IF NOT EXISTS it_prod;
CREATE SCHEMA IF NOT EXISTS shared;

-- ═══════════════════════════════════════════════════════════════
--  TABLAS DE TELEMETRÍA PICOCLAW
-- ═══════════════════════════════════════════════════════════════

-- Tabla de telemetría (esquema compartido)
CREATE TABLE IF NOT EXISTS shared.telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'voltaje', 'rpm', 'temperatura'
    valor NUMERIC(10,2) NOT NULL,
    unidad VARCHAR(20) NOT NULL, -- 'V', 'RPM', '°C'
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para telemetría
CREATE INDEX IF NOT EXISTS idx_telemetry_placa ON shared.telemetry(placa_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON shared.telemetry(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_tipo ON shared.telemetry(tipo);

-- ═══════════════════════════════════════════════════════════════
--  PROPIEDADES INMOBILIARIAS (Smarterprop)
-- ═══════════════════════════════════════════════════════════════

-- Chile Properties
CREATE TABLE IF NOT EXISTS cl_prod.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_propiedad VARCHAR(50) NOT NULL, -- 'casa', 'departamento', 'oficina'
    operacion VARCHAR(50) NOT NULL, -- 'venta', 'arriendo'
    precio NUMERIC(12,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'CLP',
    direccion TEXT NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    pais VARCHAR(2) DEFAULT 'CL',
    metros_totales NUMERIC(8,2),
    metros_construidos NUMERIC(8,2),
    dormitorios INTEGER DEFAULT 0,
    banos INTEGER DEFAULT 0,
    estacionamientos INTEGER DEFAULT 0,
    caracteristicas JSONB DEFAULT '[]'::jsonb,
    imagenes JSONB DEFAULT '[]'::jsonb,
    estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'vendido', 'arrendado'
    agente_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Italy Properties
CREATE TABLE IF NOT EXISTS it_prod.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titolo VARCHAR(255) NOT NULL,
    descrizione TEXT,
    tipo_proprieta VARCHAR(50) NOT NULL, -- 'casa', 'appartamento', 'ufficio'
    operazione VARCHAR(50) NOT NULL, -- 'vendita', 'affitto'
    prezzo NUMERIC(12,2) NOT NULL,
    valuta VARCHAR(3) DEFAULT 'EUR',
    indirizzo TEXT NOT NULL,
    citta VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    regione VARCHAR(100) NOT NULL,
    paese VARCHAR(2) DEFAULT 'IT',
    metri_totali NUMERIC(8,2),
    metri_costruiti NUMERIC(8,2),
    camere_da_letto INTEGER DEFAULT 0,
    bagni INTEGER DEFAULT 0,
    posti_auto INTEGER DEFAULT 0,
    caratteristiche JSONB DEFAULT '[]'::jsonb,
    immagini JSONB DEFAULT '[]'::jsonb,
    stato VARCHAR(20) DEFAULT 'attivo', -- 'attivo', 'venduto', 'affittato'
    agente_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para propiedades
CREATE INDEX IF NOT EXISTS idx_cl_properties_comuna ON cl_prod.properties(comuna);
CREATE INDEX IF NOT EXISTS idx_cl_properties_precio ON cl_prod.properties(precio);
CREATE INDEX IF NOT EXISTS idx_cl_properties_estado ON cl_prod.properties(estado);
CREATE INDEX IF NOT EXISTS idx_cl_properties_tipo ON cl_prod.properties(tipo_propiedad);

CREATE INDEX IF NOT EXISTS idx_it_properties_citta ON it_prod.properties(citta);
CREATE INDEX IF NOT EXISTS idx_it_properties_prezzo ON it_prod.properties(prezzo);
CREATE INDEX IF NOT EXISTS idx_it_properties_stato ON it_prod.properties(stato);
CREATE INDEX IF NOT EXISTS idx_it_properties_tipo ON it_prod.properties(tipo_proprieta);

-- ═══════════════════════════════════════════════════════════════
--  VENTAS DE TIENDA (E-commerce)
-- ═══════════════════════════════════════════════════════════════

-- Chile Sales
CREATE TABLE IF NOT EXISTS cl_prod.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_id VARCHAR(50) UNIQUE NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_rut VARCHAR(20),
    cliente_nombre VARCHAR(255),
    total NUMERIC(12,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'CLP',
    estado VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
    payment_method VARCHAR(50), -- 'flow_webpay', 'mercadopago', 'transfer'
    payment_id VARCHAR(100), -- ID externo del pago (Flow.cl o MercadoPago)
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    shipping_address JSONB,
    billing_address JSONB,
    dte_tipo INTEGER, -- 33=Factura, 39=Boleta, 61=NC, 62=ND
    dte_folio INTEGER,
    dte_track_id VARCHAR(100),
    dte_xml_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Italy Sales
CREATE TABLE IF NOT EXISTS it_prod.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordine_id VARCHAR(50) UNIQUE NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_codice_fiscale VARCHAR(20),
    cliente_nome VARCHAR(255),
    totale NUMERIC(12,2) NOT NULL,
    valuta VARCHAR(3) DEFAULT 'EUR',
    stato VARCHAR(20) DEFAULT 'in_attesa', -- 'in_attesa', 'pagato', 'spedito', 'consegnato', 'annullato'
    metodo_pagamento VARCHAR(50),
    pagamento_id VARCHAR(100),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    indirizzo_spedizione JSONB,
    indirizzo_fatturazione JSONB,
    fattura_tipo INTEGER,
    fattura_numero INTEGER,
    fattura_xml_url TEXT,
    creato_il TIMESTAMPTZ DEFAULT NOW(),
    aggiornato_il TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_cl_sales_orden ON cl_prod.sales(orden_id);
CREATE INDEX IF NOT EXISTS idx_cl_sales_estado ON cl_prod.sales(estado);
CREATE INDEX IF NOT EXISTS idx_cl_sales_cliente ON cl_prod.sales(cliente_email);
CREATE INDEX IF NOT EXISTS idx_cl_sales_created ON cl_prod.sales(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_it_sales_ordine ON it_prod.sales(ordine_id);
CREATE INDEX IF NOT EXISTS idx_it_sales_stato ON it_prod.sales(stato);
CREATE INDEX IF NOT EXISTS idx_it_sales_cliente ON it_prod.sales(cliente_email);
CREATE INDEX IF NOT EXISTS idx_it_sales_creato ON it_prod.sales(creato_il DESC);

-- ═══════════════════════════════════════════════════════════════
--  ALERTAS PICOCLAW
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS shared.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa_id INTEGER NOT NULL,
    tipo_alerta VARCHAR(50) NOT NULL, -- 'voltaje_alto', 'temperatura_critica', 'rpm_anormales'
    severidad VARCHAR(20) NOT NULL, -- 'info', 'warning', 'critical'
    mensaje TEXT NOT NULL,
    valor_trigger NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'activa', -- 'activa', 'resuelta', 'acknowledged'
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(100),
    telegram_notified BOOLEAN DEFAULT FALSE,
    telegram_message_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_placa ON shared.alerts(placa_id);
CREATE INDEX IF NOT EXISTS idx_alerts_estado ON shared.alerts(estado);
CREATE INDEX IF NOT EXISTS idx_alerts_severidad ON shared.alerts(severidad);

-- ═══════════════════════════════════════════════════════════════
--  SESSIONS MCP
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS shared.mcp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    agent_name VARCHAR(50) NOT NULL,
    session_data JSONB DEFAULT '{}'::jsonb,
    commands_executed JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour'
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON shared.mcp_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_agent ON shared.mcp_sessions(agent_name);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON shared.mcp_sessions(expires_at);

-- ═══════════════════════════════════════════════════════════════
--  VISTAS PARA DASHBOARDS
-- ═══════════════════════════════════════════════════════════════

-- Vista: Telemetría reciente por placa
CREATE OR REPLACE VIEW shared.vw_telemetry_latest AS
SELECT DISTINCT ON (placa_id, tipo)
    id,
    placa_id,
    tipo,
    valor,
    unidad,
    timestamp,
    created_at
FROM shared.telemetry
ORDER BY placa_id, tipo, timestamp DESC;

-- Vista: Propiedades activas Chile
CREATE OR REPLACE VIEW cl_prod.vw_properties_active AS
SELECT *
FROM cl_prod.properties
WHERE estado = 'activo'
ORDER BY created_at DESC;

-- Vista: Propiedades activas Italia
CREATE OR REPLACE VIEW it_prod.vw_properties_active AS
SELECT *
FROM it_prod.properties
WHERE stato = 'attivo'
ORDER BY creato_il DESC;

-- Vista: Ventas del día Chile
CREATE OR REPLACE VIEW cl_prod.vw_sales_today AS
SELECT *
FROM cl_prod.sales
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Vista: Ventas del día Italia
CREATE OR REPLACE VIEW it_prod.vw_sales_today AS
SELECT *
FROM it_prod.sales
WHERE DATE(creato_il) = CURRENT_DATE
ORDER BY creato_il DESC;

-- Vista: Alertas activas
CREATE OR REPLACE VIEW shared.vw_alerts_active AS
SELECT *
FROM shared.alerts
WHERE estado = 'activa'
ORDER BY created_at DESC;

-- ═══════════════════════════════════════════════════════════════
--  FUNCIONES PARA ACTUALIZACIÓN AUTOMÁTICA
-- ═══════════════════════════════════════════════════════════════

-- Función: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION shared.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_cl_properties_updated_at
    BEFORE UPDATE ON cl_prod.properties
    FOR EACH ROW
    EXECUTE FUNCTION shared.update_updated_at_column();

CREATE TRIGGER update_it_properties_updated_at
    BEFORE UPDATE ON it_prod.properties
    FOR EACH ROW
    EXECUTE FUNCTION shared.update_updated_at_column();

CREATE TRIGGER update_cl_sales_updated_at
    BEFORE UPDATE ON cl_prod.sales
    FOR EACH ROW
    EXECUTE FUNCTION shared.update_updated_at_column();

CREATE TRIGGER update_it_sales_updated_at
    BEFORE UPDATE ON it_prod.sales
    FOR EACH ROW
    EXECUTE FUNCTION shared.update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
--  DATOS DE PRUEBA
-- ═══════════════════════════════════════════════════════════════

-- Insertar propiedad de prueba Chile
INSERT INTO cl_prod.properties (titulo, descripcion, tipo_propiedad, operacion, precio, direccion, comuna, ciudad, region, metros_totales, dormitorios, banos, estacionamientos)
VALUES (
    'Departamento en Las Condes',
    'Hermoso departamento de 3 dormitorios en pleno corazón de Las Condes',
    'departamento',
    'venta',
    250000000,
    'Av. Apoquindo 1234, Depto 501',
    'Las Condes',
    'Santiago',
    'Metropolitana',
    85.5,
    3,
    2,
    1
) ON CONFLICT DO NOTHING;

-- Insertar propiedad de prueba Italia
INSERT INTO it_prod.properties (titolo, descrizione, tipo_proprieta, operazione, prezzo, indirizzo, citta, provincia, regione, metri_totali, camere_da_letto, bagni, posti_auto)
VALUES (
    'Appartamento a Roma',
    'Bellissimo appartamento nel centro storico di Roma',
    'appartamento',
    'vendita',
    450000,
    'Via del Corso 123',
    'Roma',
    'Roma',
    'Lazio',
    95.0,
    2,
    1,
    0
) ON CONFLICT DO NOTHING;

-- Insertar telemetría de prueba
INSERT INTO shared.telemetry (placa_id, tipo, valor, unidad)
VALUES 
    (1, 'voltaje', 220.5, 'V'),
    (2, 'rpm', 1500.0, 'RPM'),
    (3, 'temperatura', 45.2, '°C')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
ALTER TABLE shared.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared.mcp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cl_prod.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_prod.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cl_prod.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_prod.sales ENABLE ROW LEVEL SECURITY;

-- Políticas para telemetría (lectura pública, escritura autenticada)
CREATE POLICY "Telemetry is viewable by everyone" ON shared.telemetry
    FOR SELECT USING (true);

CREATE POLICY "Telemetry can be inserted by authenticated" ON shared.telemetry
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para propiedades Chile
CREATE POLICY "Properties CL viewable by everyone" ON cl_prod.properties
    FOR SELECT USING (true);

CREATE POLICY "Properties CL manageable by agents" ON cl_prod.properties
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para propiedades Italia
CREATE POLICY "Properties IT viewable by everyone" ON it_prod.properties
    FOR SELECT USING (true);

CREATE POLICY "Properties IT manageable by agents" ON it_prod.properties
    FOR ALL USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
--  COMENTARIOS DE DOCUMENTACIÓN
-- ═══════════════════════════════════════════════════════════════

COMMENT ON SCHEMA cl_prod IS 'Smarterprop Chile - Producción';
COMMENT ON SCHEMA it_prod IS 'Smarterprop Italia - Producción';
COMMENT ON SCHEMA shared IS 'Datos compartidos (telemetría, alertas, sesiones)';

COMMENT ON TABLE shared.telemetry IS 'Telemetría de placas PicoClaw (Voltaje, RPM, Temperatura)';
COMMENT ON TABLE cl_prod.properties IS 'Propiedades inmobiliarias Chile';
COMMENT ON TABLE it_prod.properties IS 'Propiedades inmobiliarias Italia';
COMMENT ON TABLE cl_prod.sales IS 'Ventas de e-commerce Chile';
COMMENT ON TABLE it_prod.sales IS 'Ventas de e-commerce Italia';
COMMENT ON TABLE shared.alerts IS 'Alertas del sistema PicoClaw';
COMMENT ON TABLE shared.mcp_sessions IS 'Sesiones de agentes MCP';

-- ═══════════════════════════════════════════════════════════════
--  FIN DEL SCRIPT
-- ═══════════════════════════════════════════════════════════════
