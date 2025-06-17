// src/pages/AddProduct.tsx
import { useEffect, useState } from 'react';
import type { Product } from '../../types/product';
import { useNavigate } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
}

function AddProduct() {
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
  if (!token) return;

  fetch('/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => setCategories(data))
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        alert('Error fetching categories');
      });
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: name === 'price' || name === 'discount' ? Number(value) : value });
  };

  const handlePictures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      const paths = fileArray.map((file) => URL.createObjectURL(file));
      setProduct({ ...product, pictures: paths });
    }
  };

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', String(product.price));
    formData.append('discount', String(product.discount));
    formData.append('category', product.category);
    files.forEach((file) => formData.append('pictures', file)); // backend must handle `pictures` as array
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to add product');
      // alert('Product added successfully!');
      navigate('/admin/products')
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error adding product');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="discount" placeholder="Discount" onChange={handleChange} className="w-full p-2 border rounded" required />

        <select name="category" onChange={handleChange} value={product.category} className="w-full p-2 border rounded" required>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input type="file" accept="image/*" multiple onChange={handlePictures} className="w-full" />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
