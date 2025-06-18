import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const CustomerDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const profileData = (await profileRes.json()).user;

        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{profile.firstName + ' '+ profile.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;