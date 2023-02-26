const { body } = require('express-validator');

const createNewGatewayValidation = [
  body('serialNumber')
    .isMongoId()
    .withMessage('Invalid serial number')
    .custom(async value => {
      const existingGateway = await Gateway.findOne({ serialNumber: value });
      if (existingGateway) {
        return Promise.reject('Serial number already exists');
      }
    }),    
  body('name').isString().withMessage('Name must be a string').isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('ipv4').isIP().withMessage('Invalid IPv4 address')
];

const createPeripheralValidation = [
  body('uid').isNumeric().withMessage('uid must be a valid number'),
  body('vendor').isString().withMessage('vendor must be a string'),
  body('status').isIn(['online', 'offline']).withMessage('status must be "online" or "offline"'),
];


module.exports = {
  createNewGatewayValidation,
  createPeripheralValidation
}