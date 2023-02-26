
const express = require('express');
const apiController = express.Router();

const gatewayRouter = require('./Gateway/routes');

apiController.use('/gateways', gatewayRouter);

module.exports = apiController;