const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contact: { type: String, required: true },
  address: { type: String, default: '' },
  email: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  medicalHistory: { type: String, default: '' },
  allergies: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  emergencyPhone: { type: String, default: '' },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
