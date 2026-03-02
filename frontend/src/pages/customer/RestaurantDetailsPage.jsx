import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../../api/client';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get(`/restaurants/${id}`);
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to fetch restaurant menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItemId) => {
    await client.post('/cart/items', { menuItemId, quantity: 1 });
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <Loader label="Loading menu..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="text-2xl font-bold">{data?.restaurant?.name}</h1>
      <p className="mb-4 text-sm text-gray-500">{data?.restaurant?.address}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.menu?.map((item) => (
          <div key={item._id} className="rounded bg-white p-4 shadow-sm">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold">₹{item.price}</span>
              <button onClick={() => addToCart(item._id)} className="rounded bg-orange-500 px-3 py-1 text-sm text-white">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
