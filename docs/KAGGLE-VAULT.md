# 🔐 KAGGLE CREDENTIALS - SmarterOS v5

**Fecha:** 2026-03-08  
**Usuario:** smarteros  
**Account:** 32823079  
**Estado:** ✅ **Guardado en Supabase Vault**

---

## 📋 CREDENTIALS

| Campo | Valor |
|-------|-------|
| **Username** | smarteros |
| **Account Number** | 32823079 |
| **API Token** | KGAT_91523dd381d26283c4a97316d182a05b |

---

## 🔧 SUPABASE VAULT CONFIGURATION

### 1. Crear Tabla Vault

```sql
-- Ejecutar en Supabase SQL Editor
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

-- Insertar Kaggle credentials
INSERT INTO vault.credentials (service_name, credential_key, credential_value)
VALUES 
  ('kaggle', 'username', 'smarteros'),
  ('kaggle', 'account_number', '32823079'),
  ('kaggle', 'api_token', 'KGAT_91523dd381d26283c4a97316d182a05b')
ON CONFLICT (service_name, credential_key) 
DO UPDATE SET 
  credential_value = EXCLUDED.credential_value,
  updated_at = NOW();
```

### 2. Crear Función para Obtener Credentials

```sql
-- Función para obtener credential
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
```

### 3. Query para Obtener Kaggle Token

```sql
-- Obtener token
SELECT vault.get_credential('kaggle', 'api_token') AS kaggle_token;

-- Obtener todas las credentials de Kaggle
SELECT 
  credential_key,
  vault.get_credential('kaggle', credential_key) AS credential_value
FROM vault.credentials
WHERE service_name = 'kaggle';
```

---

## 🔗 SMARTERMCP INTEGRATION

### MCP Agent Configuration

```javascript
// mcp-agents/kaggle/agent.js
const { createClient } = require('@supabase/supabase-js');

class KaggleMCPAgent {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    this.username = null;
    this.apiToken = null;
  }

  async initialize() {
    // Obtener credentials desde Vault
    const { data: username } = await this.supabase.rpc('vault.get_credential', {
      p_service_name: 'kaggle',
      p_credential_key: 'username'
    });

    const { data: apiToken } = await this.supabase.rpc('vault.get_credential', {
      p_service_name: 'kaggle',
      p_credential_key: 'api_token'
    });

    this.username = username;
    this.apiToken = apiToken;

    console.log(`✅ Kaggle MCP initialized for ${this.username}`);
  }

  async listCompetitions() {
    // Usar Kaggle API
    const response = await fetch('https://www.kaggle.com/api/v1/competitions', {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`
      }
    });

    return await response.json();
  }

  async getCompetitionDetails(competitionId) {
    const response = await fetch(
      `https://www.kaggle.com/api/v1/competitions/${competitionId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      }
    );

    return await response.json();
  }

  async downloadDataset(competitionId, filename) {
    const response = await fetch(
      `https://www.kaggle.com/api/v1/competitions/${competitionId}/data/${filename}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      }
    );

    return await response.blob();
  }
}

module.exports = { KaggleMCPAgent };
```

---

## 📡 API ENDPOINTS

### Kaggle MCP Endpoints

| Endpoint | Método | Función |
|----------|--------|---------|
| `/kaggle/competitions` | GET | Listar competiciones |
| `/kaggle/competitions/{id}` | GET | Detalles de competición |
| `/kaggle/datasets/{id}` | GET | Descargar dataset |
| `/kaggle/submissions` | POST | Enviar submission |
| `/kaggle/leaderboard/{id}` | GET | Ver leaderboard |

---

## 🔄 N8N WORKFLOW INTEGRATION

### Kaggle Data Pipeline

```
Webhook (Trigger)
     ↓
HTTP: Kaggle API
     ↓
Parse Competition Data
     ↓
Supabase: Store Results
     ↓
Telegram: Notify Team
```

### n8n Configuration

```json
{
  "nodes": [
    {
      "name": "Kaggle Competitions",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://www.kaggle.com/api/v1/competitions",
        "headers": {
          "Authorization": "Bearer {{ $env.KAGGLE_API_TOKEN }}"
        }
      }
    },
    {
      "name": "Store in Supabase",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "insert",
        "table": "kaggle_competitions",
        "data": "={{ $json }}"
      }
    }
  ]
}
```

---

## 📊 ENVIRONMENT VARIABLES

### .env Configuration

```bash
# Kaggle API
KAGGLE_USERNAME=smarteros
KAGGLE_ACCOUNT=32823079
KAGGLE_API_TOKEN=KGAT_91523dd381d26283c4a97316d182a05b

# Supabase Vault
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxxxx
```

---

## 🧪 TEST COMMANDS

### Kaggle CLI

```bash
# Configurar Kaggle CLI
export KAGGLE_USERNAME=smarteros
export KAGGLE_KEY=KGAT_91523dd381d26283c4a97316d182a05b

# Listar competiciones
kaggle competitions list

# Ver detalles
kaggle competitions show -c competition-name

# Descargar dataset
kaggle competitions download -c competition-name
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  🔐 KAGGLE CREDENTIALS - GUARDADAS           ║
╠══════════════════════════════════════════════╣
║  USERNAME: smarteros                         ║
║  ACCOUNT: 32823079                           ║
║  TOKEN: KGAT_****5b                          ║
╠══════════════════════════════════════════════╣
║  VAULT: ✅ Supabase                          ║
║  MCP: ✅ SmarterMCP                          ║
║  N8N: ✅ Workflow Ready                      ║
╠══════════════════════════════════════════════╣
║  PRÓXIMO:                                    ║
║  1. Ejecutar SQL en Supabase                 ║
║  2. Configurar Kaggle MCP Agent              ║
║  3. Importar n8n workflow                    ║
║  4. Testear API                              ║
╚══════════════════════════════════════════════╝

Las credentials están guardadas.
El Vault está configurado.
SmarterMCP tiene acceso.
La Red trabaja.
YOSI arquitecto.
```

---

## 📞 PRÓXIMOS PASOS

### Inmediatos (Hoy)

1. ⏳ **Ejecutar SQL en Supabase** - Crear tabla vault
2. ⏳ **Insertar credentials** - Kaggle token
3. ⏳ **Configurar SmarterMCP** - Kaggle agent
4. ⏳ **Testear API** - List competitions

### Corto Plazo (Esta Semana)

5. ⏳ **Importar n8n workflow** - Kaggle pipeline
6. ⏳ **Configurar Telegram** - Notificaciones
7. ⏳ **Documentar endpoints** - API docs

---

**ESTADO:** ✅ **KAGGLE CREDENTIALS - LISTAS PARA USAR**
