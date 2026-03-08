/**
 * SmarterOS v5 - Sales Engine API
 * FastAPI wrapper para Identity, Order, Payment Engines
 * 
 * Endpoints:
 * - POST /identity/rut/validate
 * - POST /orders/create
 * - POST /payments/flow
 * - POST /payments/flow/confirm
 */

const express = require('express');
const http = require('http');

// Import RutEngine from core/identity
const path = require('path');
const RutEngine = require(path.join(__dirname, '../../core/identity/rut-engine'));

const app = express();
const PORT = process.env.SALES_ENGINE_PORT || 3080;

app.use(express.json());

// ═══════════════════════════════════════════════════════════
// IDENTITY ENGINE ENDPOINTS
// ═══════════════════════════════════════════════════════════

/**
 * POST /identity/rut/validate
 * Valida y normaliza RUT chileno
 */
app.post('/identity/rut/validate', (req, res) => {
  try {
    const { rut } = req.body;

    if (!rut) {
      return res.status(400).json({
        success: false,
        error: 'RUT requerido'
      });
    }

    const result = RutEngine.parse(rut);

    res.json({
      success: true,
      data: result,
      valid: result.valid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /identity/rut/enrich
 * Enriquece RUT con datos de empresa (SII)
 */
app.post('/identity/rut/enrich', async (req, res) => {
  try {
    const { rut } = req.body;

    if (!rut) {
      return res.status(400).json({
        success: false,
        error: 'RUT requerido'
      });
    }

    // Simular enriquecimiento (en producción: llamar a API SII)
    const enriched = {
      rut: RutEngine.format(rut),
      razon_social: 'SMARTER SPA',
      giro: 'Servicios de software',
      tipo_persona: 'Jurídica',
      estado: 'Activo'
    };

    res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════
// ORDER ENGINE ENDPOINTS
// ═══════════════════════════════════════════════════════════

// Store temporal (en producción: PostgreSQL/Supabase)
const orders = new Map();

/**
 * POST /orders/create
 * Crea nueva orden de venta
 */
app.post('/orders/create', (req, res) => {
  try {
    const { rut, items, total, customer } = req.body;

    if (!rut || !items || !total) {
      return res.status(400).json({
        success: false,
        error: 'Datos requeridos: rut, items, total'
      });
    }

    // Generar ID de orden
    const orderId = `SMARTER-${Date.now()}`;

    // Crear orden
    const order = {
      order_id: orderId,
      rut: RutEngine.format(rut),
      items,
      total,
      customer,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Guardar
    orders.set(orderId, order);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /orders/:orderId
 * Obtener orden por ID
 */
app.get('/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /orders/:orderId/status
 * Actualizar estado de orden
 */
app.put('/orders/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    order.status = status;
    order.updated_at = new Date().toISOString();
    orders.set(orderId, order);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════
// PAYMENT ENGINE ENDPOINTS (Flow.cl)
// ═══════════════════════════════════════════════════════════

const payments = new Map();

/**
 * POST /payments/flow/create
 * Crea pago con Flow.cl
 */
app.post('/payments/flow/create', async (req, res) => {
  try {
    const { order_id, amount, email, subject } = req.body;

    if (!order_id || !amount || !email) {
      return res.status(400).json({
        success: false,
        error: 'Datos requeridos: order_id, amount, email'
      });
    }

    // Simular creación de pago en Flow.cl
    // En producción: llamar a API real de Flow.cl
    const paymentToken = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentUrl = `https://www.flow.cl/web/payment?token=${paymentToken}`;

    const payment = {
      payment_id: paymentToken,
      order_id,
      amount,
      email,
      subject: subject || `Pago orden ${order_id}`,
      status: 'pending',
      provider: 'flow',
      payment_url: paymentUrl,
      created_at: new Date().toISOString()
    };

    payments.set(paymentToken, payment);

    res.json({
      success: true,
      data: {
        payment_url: paymentUrl,
        token: paymentToken,
        amount,
        order_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /payments/flow/confirm
 * Webhook de confirmación de Flow.cl
 */
app.post('/payments/flow/confirm', async (req, res) => {
  try {
    const { token, status, commerceOrder, amount } = req.body;

    console.log('📥 Flow.cl Webhook recibido:', { token, status, commerceOrder });

    // status = 2 → pago aprobado en Flow.cl
    if (status === 2 || status === 'approved') {
      // Actualizar pago
      const payment = payments.get(token);
      if (payment) {
        payment.status = 'approved';
        payment.confirmed_at = new Date().toISOString();
        payments.set(token, payment);
      }

      // Actualizar orden
      const order = orders.get(commerceOrder);
      if (order) {
        order.status = 'paid';
        order.updated_at = new Date().toISOString();
        orders.set(commerceOrder, order);
      }

      // Emitir evento (en producción: Event Bus real)
      console.log('📤 Evento emitido: payment.confirmed', {
        order_id: commerceOrder,
        amount,
        provider: 'flow'
      });

      res.json({
        success: true,
        message: 'Pago confirmado',
        order_id: commerceOrder
      });
    } else {
      res.json({
        success: false,
        message: 'Pago no aprobado',
        status
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /payments/:paymentId
 * Obtener estado de pago
 */
app.get('/payments/:paymentId', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = payments.get(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Pago no encontrado'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════
// EVENT BUS ENDPOINTS
// ═══════════════════════════════════════════════════════════

const eventListeners = new Map();

/**
 * POST /events/subscribe
 * Suscribirse a eventos del sistema
 */
app.post('/events/subscribe', (req, res) => {
  try {
    const { event, webhook_url } = req.body;

    if (!event || !webhook_url) {
      return res.status(400).json({
        success: false,
        error: 'Datos requeridos: event, webhook_url'
      });
    }

    if (!eventListeners.has(event)) {
      eventListeners.set(event, []);
    }

    eventListeners.get(event).push(webhook_url);

    res.json({
      success: true,
      message: `Suscrito a evento: ${event}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'sales-engine-api',
    port: PORT,
    version: '1.0.0',
    endpoints: {
      identity: '/identity/rut/validate',
      orders: '/orders/create',
      payments: '/payments/flow/create',
      webhook: '/payments/flow/confirm'
    }
  });
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   💳 Sales Engine API - SmarterOS v5                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Port: ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /identity/rut/validate - Validar RUT');
  console.log('  POST /orders/create - Crear orden');
  console.log('  POST /payments/flow/create - Crear pago Flow');
  console.log('  POST /payments/flow/confirm - Webhook Flow');
  console.log('  GET  /payments/:id - Estado de pago');
  console.log('');
  console.log('n8n Workflow Ready! ✅');
  console.log('');
});
