import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({role}: {role: 'admin' | 'customer'}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

   // ✅ Only run this on initial mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (role === 'admin') {
        navigate('/admin'); // Redirect to admin dashboard if logged in as admin
      } else {
          navigate('/'); // Redirect to home if logged in as customer
    }
  }}, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user.id)
        if(data.user.role === 'customer') {
          navigate('/'); // Go to customer home
        } else {
          navigate('/admin'); // Go to admin dashboard
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error');
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {role === 'admin' ? 
      (<h2 className="text-xl font-bold mb-4">Admin Login</h2>) :
       (<h2 className="text-xl font-bold mb-4">Customer Login</h2>)}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
      { role === 'admin' ?
      <p className="mt-2 text-sm">
        Don’t have an account? <Link to="/admin/register" className="text-blue-600 underline">Register</Link>
      </p>:
      <p className="mt-2 text-sm">
        Don’t have an account? <Link to="/register" className="text-blue-600 underline">Register</Link>
      </p>}
      
    </div>
  );
}

export default Login;
