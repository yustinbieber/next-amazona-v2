const base = process.env.MERCADOPAGO_API_URL || 'https://api.mercadopago.com';

export const mercadopago = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();
    const url = `${base}/checkout/preferences`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            unit_price: price,
            quantity: 1,
          },
        ],
      }),
    });
    return handleResponse(response);
  },
  capturePayment: async function capturePayment(orderId: string) {
    // No es necesario capturar el pago en Mercado Pago como lo era en PayPal
    // Ya que Mercado Pago maneja la captura automáticamente después del pago exitoso
    return { id: orderId, status: 'captured' };
  },
};

async function generateAccessToken() {
  const { MERCADOPAGO_CLIENT_ID, MERCADOPAGO_CLIENT_SECRET } = process.env;
  const auth = Buffer.from(`${MERCADOPAGO_CLIENT_ID}:${MERCADOPAGO_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${base}/oauth/token`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  const errorMessage = await response.text()
  throw new Error(errorMessage)
}
