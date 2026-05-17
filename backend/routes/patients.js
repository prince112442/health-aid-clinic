const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

const genId = async () => {
  const count = await Patient.countDocuments();
  return `PAT-${String(count + 1).padStart(5, '0')}`;
};

router.get('/', protect, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = { active: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ patients, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const patientId = await genId();
    const patient = await Patient.create({ ...req.body, patientId, registeredBy: req.user._id });
    res.status(201).json(patient);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Patient deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
