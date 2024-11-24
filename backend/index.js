const express = require('express');
const connectDB = require('./mongoose'); // Importing the DB connection function
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const expenseRoutes = require('./routes/expenseRoute'); // Import the expense routes
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const User = require('./models/User'); // Importing the User model
const cors = require('cors'); // Import the CORS middleware

require('dotenv').config(); // Import dotenv to load environment variables
const app = express();
app.use(express.urlencoded({ extended: true }));

// CORS setup for allowing frontend access
app.use(cors({
  origin: [process.env.FRONTEND_URL,process.env.LOCAL_URI], // Frontend URL (update as needed)
  methods: ['GET', 'POST', 'PUT','DELETE'], // Allow the appropriate HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials : true,
}));
app.options('*', cors());

app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
connectDB();

// Mount expense routes at /api
app.use('/api', expenseRoutes);
app.use('/api/auth/', authRoutes)


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
