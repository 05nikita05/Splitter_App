import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logout from '../Logout'
import axiosInstance from '../../../axiosInstance'; // Assuming axiosInstance is pre-configured with baseURL.

function CreateExpense() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState([]);
  const [participantInput, setParticipantInput] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, userId, loading } = useAuth(); // Retrieve userId and loading state from context

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, navigate]);

  const handleAddParticipant = () => {
    if (participantInput) {
      setParticipants([...participants, participantInput]);
      setParticipantInput('');
    }
  };

  const handleViewExpenses = () => {
    navigate('/view-expenses');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('You must be logged in to create an expense.');
      return;
    }

    const newExpense = {
      title,
      description,
      amount,
      participants,
      userId, // Ensure userId is properly included
    };

    // console.log('Submitting Expense:', newExpense); 

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      // console.log('Token:', token);

      // API call to create a new expense
      const response = await axiosInstance.post(
        '/expenses',
        newExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      );

      if (response.status === 201) {
        console.log('Expense created successfully:', response.data);
        navigate('/view-expenses');
      } else {
        console.error('Error saving expense:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving expense:', error.message || error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Prevent rendering while authentication state is loading
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className='absolute right-4'><Logout/></div>

      <h1 className="text-3xl font-bold my-8 text-gray-800">Create New Expense</h1> 
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg space-y-6"
      >
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense description"
          ></textarea>
        </div>

        <div>
          <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount spent"
          />
        </div>

        <div>
          <label htmlFor="participants" className="block text-gray-700 font-semibold mb-2">
            Participants
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add participant name"
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          <ul className="list-disc list-inside">
            {participants.map((participant, index) => (
              <li key={index} className="text-gray-600">
                {participant}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Save Expense
        </button>

        <button
          onClick={handleViewExpenses}
          type="button"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
        >
          View All Expenses
        </button>
      </form>
    </div>
  );
}

export default CreateExpense;
