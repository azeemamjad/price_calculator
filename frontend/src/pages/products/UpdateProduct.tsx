import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../../types/product';

interface Category {
  _id: string;
  name: string;
}

function UpdateProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    title: '',
    description: '',
    price: 0,
    discount: 0,
    pictures: [],
    category: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    // Fetch product data
    fetch(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => {
        console.error('Failed to fetch product:', err);
        alert('Error loading product');
      });

    // Fetch categories
    fetch('/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        console.error('Failed to fetch categories:', err);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: name === 'price' || name === 'discount' ? Number(value) : value });
  };

  const handlePictures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', String(product.price));
    formData.append('discount', String(product.discount));
    formData.append('category', product.category);
    files.forEach((file) => formData.append('pictures', file));

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to update product');
      navigate('/admin/products');
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating product');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={product.title} placeholder="Title" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" value={product.description} placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="price" value={product.price} placeholder="Price" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="discount" value={product.discount} placeholder="Discount" onChange={handleChange} className="w-full p-2 border rounded" required />

        <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input type="file" accept="image/*" multiple onChange={handlePictures} className="w-full" />
        {product.pictures.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {product.pictures.map((pic, idx) => (
              <img key={idx} src={`http://localhost:5000/${pic}`} alt="Product pic" className="h-24 object-cover" />
            ))}
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
