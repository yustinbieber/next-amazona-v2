// lib/mercadopago.ts

const mercadopago = require("mercadopago");// Importa el módulo de Mercado Pago

// Configura tus credenciales de Mercado Pago
mercadopago.configure({
  client_id: process.env.MERCADOPAGO_CLIENT_ID,
  client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
});

// Función para crear una orden de pago en Mercado Pago
export const createMercadoPagoOrder = async (totalPrice: number) => {
  try {
    const preference = {
      items: [
        {
          title: 'Productos', // Cambia este título según tus necesidades
          quantity: 1,
          currency_id: 'USD', // Cambia la moneda según tus necesidades
          unit_price: totalPrice,
        },
      ],
    };

    const response = await mercadopago.preferences.create(preference);
    return response;
  } catch (error) {
    throw new Error('Error al crear la orden de pago en Mercado Pago');
  }
};

// Función para capturar el pago en Mercado Pago
export const captureMercadoPagoOrder = async (mercadoPagoOrderId: string) => {
  try {
    const response = await mercadopago.payment.capture(mercadoPagoOrderId);
    return response;
  } catch (error) {
    throw new Error('Error al capturar el pago en Mercado Pago');
  }
};
