const express = require('express');
const { body, validationResult } = require('express-validator');
const Gateway = require('../sdk/repositories/db/models/Gateway')


const router = express.Router();
const gatewayServices = require('../sdk/services/GatewayService');
const peripheralServices = require('../sdk/services/PeripheralService');

router.get('/', async (req, res) => {
  const gateways = await gatewayServices.getGateways(req)
  res.success({
      gateways,
  });
});


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


router.get('/:serialNumber', async (req, res) => {
  const { serialNumber } = req.params
  const gateway = await gatewayServices.fetshGateway(serialNumber)
  res.success({
      gateway,
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
        if (peripheral){
          res.status(201).json({message: 'created succefully'});
        }else {
          res.status(400).json({
            code: 401,
            message: 'gateway can only have 10 peripherals , remove at least one to add more.'
          })
        }

  
    } catch (error) {
      console.error(error);
      if (error.code = 11000){
        res.status(400).json({
          code: 401,
          message: 'peripheral UID already exist , choose another uid'
        })
      }
      res.status(500).json({ message: 'server error' });
    }
  });

  router.delete('/:serialNumber/peripherals/:peripheralId', async (req, res) => {

    try {
      const { serialNumber, peripheralId  } = req.params

        const peripheral = await peripheralServices.removePeripheral(serialNumber, peripheralId)
        if (peripheral){
          res.status(201).json({message: 'deleted succefully'});
        }else {
          res.status(400).json({
            code: 401,
            message: 'gateway can only have 10 peripherals , remove at least one to add more.'
          })
        }

  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'server error' });
    }
  });

module.exports = router;