import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Category {
    _id: string;
    name: string;
}

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    category?: Category;
    pictures?: string[];
}



export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                console.log('Product ID:', id);
                
                if (!id) {
                    throw new Error('Product ID is missing');
                }
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
                console.log(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: id, quantity })
            });

            if (!res.ok) throw new Error('Failed to add to cart');
            
            // Update local storage cart count
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            cartItems.push({ ...product, quantity });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            navigate('/cart');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to cart');
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
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={() => navigate('/customer/products')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) return null;

    const discountedPrice = product.price - (product.price * product.discount / 100);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <img 
                        src={`http://localhost:5000/${product.pictures?.[0]}`}
                        alt={product.title} 
                        className="w-full h-96 object-contain rounded-lg"
                    />
                </div>

                {/* Product Details */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                    {product.category && (
                        <p className="text-gray-500 mb-4">Category: {product.category.name}</p>
                    )}
                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <div className="mb-6">
                        <div className="flex items-baseline mb-2">
                            <span className="text-2xl font-bold text-gray-900">
                                ${discountedPrice.toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                                <>
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="ml-2 text-green-600">
                                        {product.discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                        <label className="text-gray-700">Quantity:</label>
                        <input
                            type="number"
                            min={1}
                            max={99}
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button 
                        onClick={addToCart}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}