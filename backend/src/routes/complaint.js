const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const { redactPII } = require('../services/redactionService');
const { authenticate } = require('../middlewares/auth');

// POST /api/complaint/intake
router.post('/intake', authenticate, async (req, res) => {
  try {
    const { title, descriptionRaw } = req.body;

    if (!title || !descriptionRaw) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Pass through PII Redaction Engine
    const descriptionAnonymized = await redactPII(descriptionRaw);

    const newCase = new Case({
      complainantId: req.user.id,
      title,
      descriptionRaw,
      descriptionAnonymized,
      status: 'PENDING'
    });

    await newCase.save();

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      caseId: newCase._id,
      anonymizedPreview: descriptionAnonymized
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Internal server error during complaint intake.' });
  }
});

module.exports = router;
