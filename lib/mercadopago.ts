import { Request, Response } from 'express'; // Importa tu configuración de Mercado Pago
const mercadopago = require("mercadopago");
import Product from './models/ProductModel'; // Importa el modelo de Producto desde tu base de datos

mercadopago.configure({
  client_id: process.env.MERCADOPAGO_CLIENT_ID,
  client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
});

async function createMercadoPagoOrder(req: Request, res: Response): Promise<void> {
  const orderId = req.params.id;

  try {
    // Obtener los datos del producto desde la base de datos
    const product = await Product.findById(orderId); // Suponiendo que estás utilizando Mongoose para interactuar con MongoDB

    // Lógica para crear la orden de pago en Mercado Pago
    const preference = {
      items: [{
        title: product.name,
        unit_price: product.price,
        quantity: product.quantity,
      }],
      payer: {
        email: req.body.shippingAddress.email,
      },
      // Otros campos opcionales como back_urls, notification_url, etc.
    };

    const response = await mercadopago.preferences.create(preference);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al crear la orden de pago en Mercado Pago:', error);
    res.status(500).json({ message: 'Error al crear la orden de pago en Mercado Pago' });
  }
}

export { createMercadoPagoOrder };
