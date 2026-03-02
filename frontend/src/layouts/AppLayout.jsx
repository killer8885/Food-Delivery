import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav className="bg-white shadow p-4 flex justify-between">
        <Link className="font-bold" to="/">FoodHub</Link>
        <div className="flex gap-3">
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
          {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
