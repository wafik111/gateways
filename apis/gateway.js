const express = require('express');
const { body, validationResult } = require('express-validator');
const Gateway = require('../sdk/repositories/db/models/Gateway')


const router = express.Router();
const gatewayServices = require('../sdk/services/GatewayService');
const peripheralServices = require('../sdk/services/PeripheralService');


router.post('/',
[
    body('serialNumber').isMongoId().withMessage('Invalid serial number').custom(async value => {
        const existingGateway = await Gateway.findOne({ serialNumber: value });
        if (existingGateway) {
          return Promise.reject('Serial number already exists');
        }
      }),    body('name').isString().withMessage('Name must be a string').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('ipv4').isIP().withMessage('Invalid IPv4 address')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const gateways = await gatewayServices.createGateway(req)
    res.success({
      gateways,
    });
});


router.get('/', async (req, res) => {
    const gateways = await gatewayServices.getInvoiceSettings(req)
    res.success({
        gateways,
    });
});


// Define validation rules for the create peripheral API endpoint
const createPeripheralValidator = [
    body('uid').isNumeric().withMessage('uid must be a valid number'),
    body('vendor').isString().withMessage('vendor must be a string'),
    body('status').isIn(['online', 'offline']).withMessage('status must be "online" or "offline"'),
  ];
  

router.post('/:serialNumber/peripherals', createPeripheralValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {

        const peripheral = await peripheralServices.createPeripheral(req)
      // Create a new peripheral document
  
      // Save the peripheral to the database
  
      res.status(201).json(peripheral);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;