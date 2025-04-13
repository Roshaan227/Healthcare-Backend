const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  diagnosis: String,
  treatment: String,
  medications: [String],
  notes: String,
});

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: String,
  address: String,
  contactNumber: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: false
  },
  previousVisits: [visitSchema],
  medicalHistory: String,
  allergies: String,
  medications: String,
  lastVisit: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update lastVisit when a new visit is added
patientSchema.pre('save', function(next) {
  if (this.previousVisits && this.previousVisits.length > 0) {
    this.lastVisit = this.previousVisits[this.previousVisits.length - 1].date;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema); 