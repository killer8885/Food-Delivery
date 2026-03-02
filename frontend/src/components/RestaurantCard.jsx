import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{restaurant.name}</h2>
        <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
          ⭐ {restaurant.avgRating?.toFixed(1) || '0.0'}
        </span>
      </div>
      <p className="line-clamp-1 text-sm text-gray-600">{restaurant.cuisine?.join(', ') || 'Multi cuisine'}</p>
      <p className="mt-1 text-xs text-gray-500">{restaurant.address || 'Address unavailable'}</p>
      <Link className="mt-4 inline-block rounded bg-orange-500 px-3 py-2 text-sm font-medium text-white" to={`/restaurants/${restaurant._id}`}>
        View menu
      </Link>
    </div>
  );
}
