import { useEffect, useState } from 'react';

interface AdminInfo {
  firstName: string;
  lastName: string;
  email: string;
}

function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const token = localStorage.getItem('token');
  useEffect(() => {
    // Fetch admin info
    fetch('http://localhost:5000/api/admin/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.user) setAdmin(data.user);
      })
      .catch(console.error);

    // Fetch category count
    fetch('http://localhost:5000/api/categories/count', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') setCategoryCount(data.count);
      })
      .catch(console.error);

    // Fetch product count
    fetch('http://localhost:5000/api/products/count', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') setProductCount(data.count);
      })
      .catch(console.error);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Optionally redirect to login page:
    window.location.href = '/';
    window.location.reload();
  };

  if (!admin) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded mt-10 flex flex-col">
      <h1 className="text-3xl font-semibold mb-4">
        Welcome back, {admin.firstName} {admin.lastName}!
      </h1>
      <p className="text-gray-600 mb-8">
        Email: <span className="font-medium">{admin.email}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Total Categories</h2>
          <p className="text-4xl font-extrabold text-blue-700">{categoryCount}</p>
        </div>

        <div className="bg-green-100 p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Total Products</h2>
          <p className="text-4xl font-extrabold text-green-700">{productCount}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
