import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    discount: number;
    pictures: string[];
  };
  quantity: number;
}

interface CartData {
  items: CartItem[];
}

const Cart = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating cart');
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to remove item');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing item');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCart({ items: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error clearing cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:underline"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.product.price;
      const discount = item.product.discount;
      const discountedPrice = price - (price * discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {cart.items.map((item) => (
          <div key={item.product._id} className="border-b p-4">
            <div className="flex items-center">
              <img
                src={`http://localhost:5000/${item.product.pictures[0]}`}
                alt={item.product.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{item.product.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-gray-600">
                    ${(item.product.price - (item.product.price * item.product.discount / 100)).toFixed(2)}
                  </span>
                  {item.product.discount > 0 && (
                    <span className="ml-2 text-sm text-green-600">
                      {item.product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;