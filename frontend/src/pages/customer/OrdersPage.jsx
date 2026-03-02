import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function OrdersPage() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('order-status-updated', (order) => {
      setUpdates((prev) => [order, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Real-time Order Tracking</h1>
      {updates.map((order) => (
        <div key={order._id} className="bg-white p-3 rounded shadow">
          Order {order._id}: <strong>{order.status}</strong>
        </div>
      ))}
    </div>
  );
}
