import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateExpense = () => {
    // Redirect based on authentication status
    navigate(isAuthenticated ? '/create-expense' : '/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-md p-6">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Manage Your Expenses
        </h1>

        {/* Action Button */}
        <div className="space-y-4 w-full">
          <button
            onClick={handleCreateExpense}
            className="w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Create New Expense
          </button>
        </div>
      </main>
    </div>
  );
}

export default Layout;
