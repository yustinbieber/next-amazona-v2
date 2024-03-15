// api/orders/[id]/create-mercadopago-order.ts

import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { createMercadoPagoOrder } from '@/lib/mercadopago';

export const POST = async (req: { query: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: any; }): any; new(): any; }; }; }) => {
  await dbConnect();

  const { id } = req.query;

  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const mercadoPagoOrder = await createMercadoPagoOrder(order.totalPrice);
    return res.status(200).json(mercadoPagoOrder);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
