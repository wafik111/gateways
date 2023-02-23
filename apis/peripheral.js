const express = require('express');
const { body, validationResult } = require('express-validator');
const Gateway = require('../sdk/repositories/db/models/Gateway')


const router = express.Router();
const gatewayServices = require('../sdk/services/GatewayService');

// Define validation rules for the create peripheral API endpoint
const createPeripheralValidator = [
  body('uid').isMongoId().withMessage('uid must be a valid Mongo ObjectId'),
  body('vendor').isString().withMessage('vendor must be a string'),
  body('date').isISO8601().withMessage('date must be a valid ISO8601 date string'),
  body('status').isIn(['online', 'offline']).withMessage('status must be "online" or "offline"'),
];

// Create the create peripheral API endpoint
router.post('/gatewaySerial', createPeripheralValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create a new peripheral document

    // Save the peripheral to the database


    res.status(201).json(peripheral);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});








module.exports = router;