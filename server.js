require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require('./middleware/errorHandler');
const inputRoutes = require('./routes/inputRoutes');


connectDB(); // Connect to MongoDB
const app = express();

//  middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Routes
app.use("/api/auth", authRoutes); // Mount auth routes
app.use("/api/users", userRoutes); // Mount user routes
app.use('/api/farms', require('./routes/farmRoutes')); 
app.use('/api/inputs', require('./routes/inputRoutes')); 
app.use('/api/spending', require('./routes/spendingRoutes')); 
app.use('/api/pricing', require('./routes/pricingRoutes')); 
app.use('/api/groups', require('./routes/groupRoutes')); 
app.use('/api/suppliers', require('./routes/supplierRoutes')); 
app.use('/api/planning', require('./routes/planningRoutes')); 
app.use('/api/verification', require('./routes/verificationRoutes')); 


// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
