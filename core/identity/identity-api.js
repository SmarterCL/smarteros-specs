/**
 * SmarterOS v5 - Identity API
 * REST API para validación y enriquecimiento de RUT
 */

const http = require('http');
const RutEngine = require('./rut-engine');
const RutEnrichment = require('./rut-enrichment');

const PORT = process.env.IDENTITY_PORT || 3070;

const enrichment = new RutEnrichment();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Health check
    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        service: 'identity-engine',
        port: PORT,
        version: '1.0.0'
      }));
      return;
    }

    // Validar RUT
    if (url.pathname === '/api/v1/identity/validate' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { rut } = JSON.parse(body);

          if (!rut) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'RUT requerido' }));
            return;
          }

          const result = RutEngine.parse(rut);

          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: result,
            valid: result.valid
          }));
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // Enriquecer RUT
    if (url.pathname === '/api/v1/identity/enrich' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { rut } = JSON.parse(body);

          if (!rut) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'RUT requerido' }));
            return;
          }

          const enriched = await enrichment.enrich(rut);

          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: enriched
          }));
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // Obtener datos por RUT
    if (url.pathname.startsWith('/api/v1/identity/') && req.method === 'GET') {
      const rut = url.pathname.split('/').pop();

      if (!rut) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'RUT requerido' }));
        return;
      }

      const parsed = RutEngine.parse(rut);
      const enriched = await enrichment.enrich(rut);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
          ...parsed,
          ...enriched
        }
      }));
      return;
    }

    // Normalizar RUT
    if (url.pathname === '/api/v1/identity/normalize' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { rut } = JSON.parse(body);

          if (!rut) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'RUT requerido' }));
            return;
          }

          const normalized = RutEngine.normalizeForDB(rut);

          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            data: normalized
          }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
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

server.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   🆔 Identity Engine - SmarterOS v5                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Port: ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/v1/identity/validate - Validar RUT');
  console.log('  POST /api/v1/identity/enrich - Enriquecer RUT');
  console.log('  GET  /api/v1/identity/:rut - Obtener datos');
  console.log('  POST /api/v1/identity/normalize - Normalizar para DB');
  console.log('');
  console.log('Ejemplos:');
  console.log('  curl -X POST http://localhost:3070/api/v1/identity/validate \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"rut": "12.345.678-5"}\'');
  console.log('');
});
