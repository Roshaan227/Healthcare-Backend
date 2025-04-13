const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create Tayyaba admin user
    const admin = new User({
      username: 'Tayyaba',
      password: 'Tayyaba65227',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user (Tayyaba) created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin(); 