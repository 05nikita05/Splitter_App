import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axiosInstance from '../../axiosInstance';
function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from AuthContext

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation for username and password fields
    if (!username.trim() || !password.trim()) {
      setError('Both fields are required and cannot contain only spaces.');
      return;
    }

    setLoading(true);

    try {
      // Send a request to the server for signing in
      const res = await axiosInstance.post('/auth/signin', {
        username,
        password,
      });
      console.log(res.data)

      // Extract token and user data from the response
      const { token, user } = res.data;

      if (token && user) {
        // Save token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Call login function from AuthContext to update authentication state
        login(user);

        alert('User signed in successfully!');
        navigate('/create-expense'); // Redirect after login
      } else {
        setError('Invalid server response. Please try again later.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        console.log(error)
        setError('Unable to sign in. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign In</h2>
        
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSignin} className="flex flex-col gap-4">
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <a className="text-blue-500" href="/register">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signin;
