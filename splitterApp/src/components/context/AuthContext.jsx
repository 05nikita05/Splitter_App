import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Custom hook for easier access to AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Load user data from localStorage on component mount
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse and set the user
        setIsAuthenticated(true); // Mark as authenticated
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Always set loading to false
    }
  }, []);

  const login = (userData) => {
    // Save user data to localStorage and update state
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove user data from localStorage and reset state
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Optionally remove the token
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {!loading && children /* Render children only after loading is complete */}
    </AuthContext.Provider>
  );
};
