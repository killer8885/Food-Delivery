import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/restaurants').then(({ data }) => setRestaurants(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading restaurants...</p>;
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {restaurants.map((restaurant) => (
        <div key={restaurant._id} className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">{restaurant.name}</h2>
          <p className="text-sm">Rating: {restaurant.avgRating.toFixed(1)}</p>
          <Link className="text-orange-600" to={`/restaurants/${restaurant._id}`}>View menu</Link>
        </div>
      ))}
    </div>
  );
}
