import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { client.get('/delivery/orders').then(({ data }) => setOrders(data)); }, []);
  return (
    <div>
      <h1 className="text-xl font-semibold">Available Deliveries</h1>
      {orders.map((order) => <div className="bg-white p-3 rounded mt-2" key={order._id}>{order._id}</div>)}
    </div>
  );
}
