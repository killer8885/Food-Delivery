import { useEffect, useState } from 'react';
import client from '../../api/client';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/delivery/orders');
      setOrders(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const accept = async (id) => {
    await client.post(`/delivery/orders/${id}/accept`);
    load();
  };

  useEffect(() => { load(); }, []);
  if (loading) return <Loader label="Loading delivery orders..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!orders.length) return <EmptyState title="No available deliveries" subtitle="New assigned orders will appear here." />;

  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Available Deliveries</h1>
      <div className="space-y-2">
        {orders.map((order) => (
          <div className="flex items-center justify-between rounded bg-white p-3 shadow-sm" key={order._id}>
            <span className="text-sm">{order._id}</span>
            <button onClick={() => accept(order._id)} className="rounded bg-green-600 px-3 py-1 text-white">Accept</button>
          </div>
        ))}
      </div>
    </div>
  );
}
