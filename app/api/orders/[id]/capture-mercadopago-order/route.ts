// api/orders/[id]/capture-mercadopago-order.ts

import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { captureMercadoPagoOrder } from '@/lib/mercadopago';

export const POST = async (req: { query: { id: any; }; body: { mercadoPagoOrderId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: any; }): any; new(): any; }; }; }) => {
    await dbConnect();
  
    const { id } = req.query;
    const { mercadoPagoOrderId } = req.body;
  
    try {
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const captureData = await captureMercadoPagoOrder(mercadoPagoOrderId);
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
      };
      const updatedOrder = await order.save();
  
      return res.status(200).json(updatedOrder);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
  