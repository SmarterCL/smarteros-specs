/**
 * SmarterOS v5 - Kaggle MCP Agent
 * Integration with Supabase Vault for secure credential management
 */

const { createClient } = require('@supabase/supabase-js');

class KaggleMCPAgent {
  constructor(supabaseUrl, supabaseKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.username = null;
    this.apiToken = null;
    this.initialized = false;
  }

  /**
   * Initialize Kaggle MCP Agent with credentials from Vault
   */
  async initialize() {
    try {
      // Obtener username desde Vault
      const { data: username, error: usernameError } = await this.supabase
        .rpc('vault.get_credential', {
          p_service_name: 'kaggle',
          p_credential_key: 'username'
        });

      if (usernameError) throw usernameError;

      // Obtener API token desde Vault
      const { data: apiToken, error: tokenError } = await this.supabase
        .rpc('vault.get_credential', {
          p_service_name: 'kaggle',
          p_credential_key: 'api_token'
        });

      if (tokenError) throw tokenError;

      this.username = username;
      this.apiToken = apiToken;
      this.initialized = true;

      console.log(`✅ Kaggle MCP initialized for ${this.username}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Kaggle MCP:', error.message);
      return false;
    }
  }

  /**
   * List Kaggle competitions
   */
  async listCompetitions(options = {}) {
    if (!this.initialized) {
      throw new Error('Kaggle MCP not initialized. Call initialize() first.');
    }

    const response = await fetch('https://www.kaggle.com/api/v1/competitions', {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get competition details
   */
  async getCompetitionDetails(competitionId) {
    if (!this.initialized) {
      throw new Error('Kaggle MCP not initialized.');
    }

    const response = await fetch(
      `https://www.kaggle.com/api/v1/competitions/${competitionId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Download competition dataset
   */
  async downloadDataset(competitionId, filename) {
    if (!this.initialized) {
      throw new Error('Kaggle MCP not initialized.');
    }

    const response = await fetch(
      `https://www.kaggle.com/api/v1/competitions/${competitionId}/data/${filename}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.statusText}`);
    }

    return await response.blob();
  }

  /**
   * Submit to competition
   */
  async submitSubmission(competitionId, teamName, submissionFile) {
    if (!this.initialized) {
      throw new Error('Kaggle MCP not initialized.');
    }

    const formData = new FormData();
    formData.append('teamName', teamName);
    formData.append('submissionFile', submissionFile);

    const response = await fetch(
      `https://www.kaggle.com/api/v1/competitions/${competitionId}/submit`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get leaderboard for competition
   */
  async getLeaderboard(competitionId) {
    if (!this.initialized) {
      throw new Error('Kaggle MCP not initialized.');
    }

    const response = await fetch(
      `https://www.kaggle.com/api/v1/competitions/${competitionId}/leaderboard`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Log credential access to audit log
   */
  async logAccess(action) {
    try {
      await this.supabase.rpc('vault.log_access', {
        p_action: action,
        p_service_name: 'kaggle',
        p_credential_key: 'api_token'
      });
    } catch (error) {
      console.error('Failed to log access:', error.message);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// MCP SERVER INTEGRATION
// ═══════════════════════════════════════════════════════════

const http = require('http');

class KaggleMCPServer {
  constructor(port = 3110) {
    this.port = port;
    this.agent = null;
  }

  async initialize(supabaseUrl, supabaseKey) {
    this.agent = new KaggleMCPAgent(supabaseUrl, supabaseKey);
    await this.agent.initialize();
  }

  start() {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${this.port}`);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');

      try {
        // Health check
        if (url.pathname === '/health') {
          res.writeHead(200);
          res.end(JSON.stringify({
            status: 'ok',
            service: 'kaggle-mcp',
            username: this.agent?.username || 'not_initialized',
            initialized: this.agent?.initialized || false
          }));
          return;
        }

        // List competitions
        if (url.pathname === '/kaggle/competitions' && req.method === 'GET') {
          const competitions = await this.agent.listCompetitions();
          res.writeHead(200);
          res.end(JSON.stringify(competitions));
          return;
        }

        // Get competition details
        if (url.pathname.startsWith('/kaggle/competitions/') && req.method === 'GET') {
          const competitionId = url.pathname.split('/').pop();
          const details = await this.agent.getCompetitionDetails(competitionId);
          res.writeHead(200);
          res.end(JSON.stringify(details));
          return;
        }

        // Get leaderboard
        if (url.pathname.startsWith('/kaggle/leaderboard/') && req.method === 'GET') {
          const competitionId = url.pathname.split('/').pop();
          const leaderboard = await this.agent.getLeaderboard(competitionId);
          res.writeHead(200);
          res.end(JSON.stringify(leaderboard));
          return;
        }

        // 404
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));

      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });

    server.listen(this.port, () => {
      console.log('╔══════════════════════════════════════════════════════════╗');
      console.log('║   📊 Kaggle MCP Server - SmarterOS v5                    ║');
      console.log('╚══════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`Port: ${this.port}`);
      console.log(`Health: http://localhost:${this.port}/health`);
      console.log('');
      console.log('Endpoints:');
      console.log('  GET  /health - Health check');
      console.log('  GET  /kaggle/competitions - List competitions');
      console.log('  GET  /kaggle/competitions/:id - Competition details');
      console.log('  GET  /kaggle/leaderboard/:id - Leaderboard');
      console.log('');
    });
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

if (require.main === module) {
  const server = new KaggleMCPServer(3110);
  
  const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
  const SUPABASE_KEY = process.env.SUPABASE_KEY || 'your-key-here';
  
  server.initialize(SUPABASE_URL, SUPABASE_KEY).then(() => {
    server.start();
  });
}

module.exports = { KaggleMCPAgent, KaggleMCPServer };
