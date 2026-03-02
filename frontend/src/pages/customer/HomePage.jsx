import { useEffect, useState } from 'react';
import client from '../../api/client';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import RestaurantCard from '../../components/RestaurantCard';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/restaurants');
      setRestaurants(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  if (loading) return <Loader label="Loading restaurants..." />;
  if (error) return <ErrorState message={error} onRetry={fetchRestaurants} />;
  if (!restaurants.length) return <EmptyState title="No restaurants found" subtitle="Please check back later." />;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {restaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
    </div>
  );
}
