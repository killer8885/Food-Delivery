import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { updateCartCount } = useCart();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/cart');
      setCart(data);
      updateCartCount(data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const subtotal = useMemo(() => cart?.items?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0, [cart]);

  if (loading) return <Loader label="Loading cart..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!cart?.items?.length) return <EmptyState title="Your cart is empty" subtitle="Add tasty items from restaurants." />;

  return (
    <div className="rounded bg-white p-4 shadow-sm">
      <h1 className="mb-3 text-xl font-semibold">Your Cart</h1>
      <div className="space-y-2">
        {cart.items.map((item) => (
          <div className="flex justify-between border-b py-2" key={item._id}>
            <span>{item.quantity} × ₹{item.price}</span>
            <span>₹{item.quantity * item.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right text-lg font-semibold">Subtotal: ₹{subtotal}</div>
    </div>
  );
}
