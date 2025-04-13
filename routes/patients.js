const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all patients
router.get('/', verifyToken, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ lastVisit: -1 });
    console.log(`Found ${patients.length} patients`);
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single patient
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new patient
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating new patient with data:', req.body);
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();
    console.log('Patient created successfully:', savedPatient._id);
    res.status(201).json(savedPatient);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ 
      message: 'Failed to create patient', 
      error: error.message,
      details: error.errors 
    });
  }
});

// Update patient
router.put('/:id', verifyToken, async (req, res) => {
  try {
    console.log('Updating patient:', req.params.id);
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('Patient updated successfully');
    res.json(patient);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ 
      message: 'Failed to update patient', 
      error: error.message,
      details: error.errors 
    });
  }
});

// Delete patient
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    console.log('Deleting patient:', req.params.id);
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    console.log('Patient deleted successfully');
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ 
      message: 'Failed to delete patient', 
      error: error.message 
    });
  }
});

// Add visit to patient
router.post('/:id/visits', verifyToken, async (req, res) => {
  try {
    console.log('Adding visit to patient:', req.params.id);
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.previousVisits.push(req.body);
    const updatedPatient = await patient.save();
    
    console.log('Visit added successfully');
    res.status(201).json(updatedPatient);
  } catch (error) {
    console.error('Add visit error:', error);
    res.status(500).json({ 
      message: 'Failed to add visit', 
      error: error.message 
    });
  }
});

module.exports = router; 