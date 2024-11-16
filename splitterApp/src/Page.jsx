import { useEffect, useState } from 'react';
import axios from 'axios';

function ProtectedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/protected', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    }
  }, []);

  return isAuthenticated ? (
    <div>Welcome to the protected page!</div>
  ) : (
    <div>Access Denied</div>
  );
}

export default ProtectedPage;
