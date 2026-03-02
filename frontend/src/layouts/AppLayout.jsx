import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-10 bg-white shadow">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
          <Link className="text-xl font-bold text-orange-600" to="/">FoodHub</Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <NavLink to="/" className="text-gray-700">Home</NavLink>
            <NavLink to="/cart" className="text-gray-700">Cart ({cartCount})</NavLink>
            <NavLink to="/orders" className="text-gray-700">Orders</NavLink>
            {user?.role === 'ADMIN' && <NavLink to="/admin" className="text-gray-700">Admin</NavLink>}
            {user?.role === 'DELIVERY_PARTNER' && <NavLink to="/delivery" className="text-gray-700">Delivery</NavLink>}
            {user ? (
              <button onClick={logout} className="rounded bg-gray-900 px-3 py-1 text-white">Logout</button>
            ) : (
              <Link className="rounded bg-orange-500 px-3 py-1 text-white" to="/login">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
