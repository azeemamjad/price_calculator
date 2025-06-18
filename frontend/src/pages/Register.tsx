import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register({role}: { role?: string }) {
  const navigate = useNavigate();
  
    // ✅ Only run this on initial mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin'); // Redirect if already logged in
    }
  }, [navigate]);
  
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: role || 'customer' // Default to customer if no role provided
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user.id)
        navigate('/admin/'); // go to admin dashboard
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Error occurred');
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {role === 'admin' ? (<h2 className="text-xl font-bold mb-4">Admin Registration</h2>) 
      : (<h2 className="text-xl font-bold mb-4">Customer Registration</h2>)}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="firstname" placeholder="First Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="lastname" placeholder="Last Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="username" placeholder="Username" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleChange} required />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </form>
      {role === 'admin' ? <p className="mt-2 text-sm">
        Already registered? <Link to="/admin/login" className="text-blue-600 underline">Login</Link>
      </p>:
      <p className="mt-2 text-sm">
        Already registered? <Link to="/login" className="text-blue-600 underline">Login</Link>
      </p>}
    </div>
  );
}

export default Register;
