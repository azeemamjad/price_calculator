import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

interface Product {
  _id: string;
  title: string;
  price: number;
  discount: number;
  category: string;
  pictures: string[];
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async (pageNumber: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/products?page=${pageNumber}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Handle delete
  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete product');

      // Refresh products after delete
      fetchProducts(page);
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting product');
    }
  };

  // Handle update - navigate to edit page
  const handleUpdate = (productId: string) => {
    navigate(`/admin/update-product/${productId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-600 text-center mt-8">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="px-3 py-1 border rounded">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
