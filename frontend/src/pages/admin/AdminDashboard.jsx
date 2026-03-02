import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { client.get('/admin/analytics').then(({ data }) => setStats(data)); }, []);
  if (!stats) return <p>Loading analytics...</p>;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded">Revenue: ₹{stats.revenue}</div>
      <div className="bg-white p-4 rounded">Active Users: {stats.activeUsers}</div>
      <div className="bg-white p-4 rounded">Restaurants: {stats.restaurantsCount}</div>
      <div className="bg-white p-4 rounded">Menu Items: {stats.menuItemsCount}</div>
    </div>
  );
}
