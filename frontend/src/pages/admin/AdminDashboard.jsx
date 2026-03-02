import { useEffect, useState } from 'react';
import client from '../../api/client';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const { data } = await client.get('/admin/analytics');
      setStats(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load analytics');
    }
  };

  useEffect(() => { load(); }, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!stats) return <Loader label="Loading analytics..." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded bg-white p-4 shadow-sm">Revenue: ₹{stats.revenue}</div>
      <div className="rounded bg-white p-4 shadow-sm">Active Users: {stats.activeUsers}</div>
      <div className="rounded bg-white p-4 shadow-sm">Restaurants: {stats.restaurantsCount}</div>
      <div className="rounded bg-white p-4 shadow-sm">Menu Items: {stats.menuItemsCount}</div>
    </div>
  );
}
