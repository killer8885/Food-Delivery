import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  useEffect(() => { client.get('/cart').then(({ data }) => setCart(data)); }, []);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-xl font-semibold">Your Cart</h1>
      {!cart?.items?.length ? <p>Cart is empty</p> : cart.items.map((item) => <p key={item._id}>{item.quantity} x ₹{item.price}</p>)}
    </div>
  );
}
