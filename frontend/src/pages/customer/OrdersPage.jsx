import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function OrdersPage() {
  const [updates, setUpdates] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { transports: ['websocket'] });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('order-status-updated', (order) => setUpdates((prev) => [order, ...prev.filter((it) => it._id !== order._id)]));
    return () => socket.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Real-time Order Tracking</h1>
        <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-red-500'}`}>
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>
      {!updates.length && <EmptyState title="No live order updates yet" subtitle="Updates will appear as your order status changes." />}
      {updates.map((order) => (
        <div key={order._id} className="rounded bg-white p-3 shadow-sm">
          <div className="mb-2 text-sm text-gray-500">Order {order._id}</div>
          <StatusBadge status={order.status} />
        </div>
      ))}
    </div>
  );
}
