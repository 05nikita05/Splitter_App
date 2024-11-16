import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signin from '../SignIn';
import Signup from '../SignUp';
import Layout from '../Layout';
import ProtectedRoute from './ProtectedRoute';
import CreateExpense from '../partials/CreateExpense';
import ViewExpense from '../partials/ViewExpense';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/register" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/create-expense" element={<CreateExpense />} />
        <Route path="/view-expenses" element={<ViewExpense />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
