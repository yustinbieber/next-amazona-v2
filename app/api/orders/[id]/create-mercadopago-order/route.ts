const express = require('express');
const router = express.Router();
const { createMercadoPagoOrder, captureMercadoPagoOrder } = require('@/lib/mercadopago');

// Ruta para crear una orden de pago de Mercado Pago
router.post('/api/orders/:id/create-mercadopago-order', createMercadoPagoOrder);

// Ruta para capturar un pago de Mercado Pago
router.post('/api/orders/:id/capture-mercadopago-order', captureMercadoPagoOrder);

module.exports = router;