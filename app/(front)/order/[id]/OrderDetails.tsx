// pages/orderdetails.tsx

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react'; // Importa useState
import { OrderItem } from '@/lib/models/OrderModel';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { createMercadoPagoOrder } from '@/lib/mercadopago';

interface OrderDetailsProps {
  orderId: string;
  paypalClientId: string;
  mercadoPagoClientId: string;
}

export default function OrderDetails({ orderId, paypalClientId, mercadoPagoClientId }: OrderDetailsProps) {
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message);
    }
  );

  const { data: session } = useSession();
  console.log(session);
  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Order paid successfully');
      });
  }

  const [paymentUrl, setPaymentUrl] = useState(""); // Declaración de setPaymentUrl

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) return error.message;
  if (!data) return 'Loading...';

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  return (
    <div>
      <h1 className="text-2xl py-4">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.email}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>

                {!isPaid && paymentMethod === 'PayPal' && (
                  <li>
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  </li>
                )}
                {!isPaid && paymentMethod === 'Mercado Pago' && (
                  <li>
                    <form action={`/api/orders/${orderId}/capture-mercadopago-order`} method="post">
                      <input type="hidden" name="mercadoPagoOrderId" value={paymentUrl} />
                      <button type="submit" className="btn">
                        Pay with Mercado Pago
                      </button>
                    </form>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
