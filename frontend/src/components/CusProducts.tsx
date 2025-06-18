import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
    _id: string;
    name: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  pictures: string[];
  category: Category;
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const CProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()
    const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products?page=${currentPage}`,
            {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId: product._id, 
          quantity: 1 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      // Show success message or update cart count
      alert('Item added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err instanceof Error ? err.message : 'Error adding item to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
      <h1 className="text-2xl font-bold mb-6" >Products</h1>
        {isAdmin && (
          <button
            onClick={() => navigate('/admin/add-product')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id}  onClick={(e) => {
      e.preventDefault();
      navigate(`/customer/products-detail/${product._id}`);
    }} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={`http://localhost:5000/${product.pictures[0]}`}
              alt={product.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-gray-500 mb-4">Category: {product.category.name}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold">${product.price}</span>
                  {product.discount > 0 && (
                    <span className="ml-2 text-sm text-green-600">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CProducts;