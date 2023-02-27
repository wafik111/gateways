
const gatewayCtrl = require('./controller/gateways');
const express = require('express');
const { createNewGatewayValidation, createPeripheralValidation } = require('./middleware/validations/schemas');
const { validateRequest } = require('./middleware/validate-request');
const router = express.Router();

router.post('/', ...createNewGatewayValidation, validateRequest, gatewayCtrl.createNewGateway);
router.get('/', gatewayCtrl.listAllGateways);
router.get('/:serialNumber', gatewayCtrl.getGatewayBySerialNumber);

router.post(
  '/:serialNumber/peripherals', 
  ...createPeripheralValidation, 
  validateRequest, 
  gatewayCtrl.createNewPeripheralDevice
);

router.delete('/:serialNumber/peripherals/:peripheralId', gatewayCtrl.removePerpheral);

module.exports = router;