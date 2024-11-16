import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../../../axiosInstance";
import Logout from '../Logout'

const ViewExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }

    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/expenses");
        setExpenses(response.data.expenses);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [isAuthenticated, loading, navigate]);

  const handleUpdateExpense = async (
    expenseId,
    participant,
    isChecked,
    sharePerParticipant
  ) => {
    try {
      const updatedAmount = isChecked ? parseFloat(sharePerParticipant) : 0;

      await axiosInstance.put(`/expenses/${expenseId}`, {
        userId: participant,
        paidAmount: updatedAmount,
      });

      // Fetch updated expenses
      const response = await axiosInstance.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axiosInstance.delete(`/expenses/${expenseId}`);
        // Fetch updated list of expenses
        const response = await axiosInstance.get('/expenses');
        setExpenses(response.data.expenses);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className='absolute right-4'><Logout/></div>

      <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
        Your Expenses
      </h1>
      <div className="w-full max-w-5xl mx-auto">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-500">No expenses found.</p>
        ) : (
          <div className="space-y-6">
            { expenses.map((expense) => {
              const sharePerParticipant = (
                expense.amount / expense.participants.length
              ).toFixed(2);
              const paidAmounts = expense.paidAmounts.reduce((acc, p) => {
                acc[p.userId] = p.amount;
                return acc;
              }, {});

              return (
                <div
                  key={expense._id}
                  className="bg-white shadow-md rounded-lg p-6"
                > 
                  <h2 className="text-2xl font-semibold text-green-800">
                    {expense.title}
                  </h2>
                  <p className="text-gray-500 mt-2">{expense.description}</p>
                  <div className="mt-4">
                    <p className="text-lg font-medium text-gray-800">
                      Total Amount:{" "}
                      <span className="text-green-600">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Participants:{" "}
                      <span className="font-medium text-gray-800">
                        {expense.participants.join(", ")}
                      </span>
                    </p>
                    <p className="text-lg font-medium text-gray-800 mt-2">
                      Each Participant's Share:{" "}
                      <span className="text-blue-500">
                        ${sharePerParticipant}
                      </span>
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Manage Payments
                    </h3>
                    <div className="space-y-2">
                      {expense.participants.map((participant) => (
                        <div
                          key={participant}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
                        >
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                              checked={paidAmounts[participant] > 0}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                handleUpdateExpense(
                                  expense._id,
                                  participant,
                                  isChecked,
                                  sharePerParticipant
                                );
                              }}
                            />
                            <span className="text-gray-700">
                              {participant} - Paid:{" "}
                              <span className="font-medium text-green-500">
                                $
                                {paidAmounts[participant]
                                  ? paidAmounts[participant].toFixed(2)
                                  : "0.00"}
                              </span>
                            </span>

                          </label>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
  onClick={() => handleDeleteExpense(expense._id)}
  className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
>
  Delete Expense
</button>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpense;
