const express = require('express');
const Gateway = require('../models/Gateway')
const {validationResult} = require('express-validator');



const router = express.Router();
const gatewayService = require('../services/GatewayService');
const peripheralService = require('../../Peripheral/services/PeripheralService');

async function listAllGateways(req, res) {
  try {
    const gateways = await gatewayService.getGateways()
    return res.status(200).send({ data: gateways });
  }
  catch (error) {
    console.log('GATEWAY_CONTROLLER_ERROR: listAllGateways ', error);
    return res.status(500).json({message: `Couldn't List All Gateways at the moment`});
  }
}

async function createNewGateway(req, res) {
  const { serialNumber, ipv4, name } = req.body;
  try {
    const newGateway = await gatewayService.createGateway({ serialNumber, ipv4, name })
    return res.status(201).send({ data: newGateway });
  }
  catch (error) {
    console.log('GATEWAY_CONTROLLER_ERROR: createNewGateway ', error);
    return res.status(500).json({ message: `Couldn't Create New Gateway at the moment` });
  }
}


async function getGatewayBySerialNumber(req, res) {
  const { serialNumber } = req.params
  try {
    const gateway = await gatewayService.findGatewayBySerialNumber(serialNumber);

    if (!gateway) {
      return res.status(404).json({
        error: `Gateway with SN ${serialNumber} Was Not Found`
      });
    };

    return res.status(200).send({ data: gateway });
  }
  catch (error) {
    console.error('GATEWAY_CONTROLLER_ERROR: getGatewayBySerialNumber ', error);
    return res.status(500).json({ message: `Couldn't Fetch Gateway info at the moment` });
  }
}

async function createNewPeripheralDevice(req, res) {
  const { uid, vendor, status } = req.body;
  const { serialNumber: gatewaySerialNumber } = req.params

  try {
    const peripheral = await peripheralService.createPeripheral({ uid, vendor, status }, gatewaySerialNumber);
    if (peripheral) {
      return res.status(201).send({ data: peripheral });
    }
    else {
      console.error('GATEWAY_CONTROLLER_ERROR: createNewPeripheralDevice',error);
      return res.status(400).json({
        error: 'gateway can only have 10 peripherals , remove at least one to add more.'
      })
    }
  }
  catch (error) {
    console.error('GATEWAY_CONTROLLER_ERROR: createNewPeripheralDevice ',error);
    if (error.code = 11000) {
      return res.status(400).json({
        error: 'peripheral UID already exist , choose another uid'
      })
    }
    return res.status(500).json({ message: 'Could not create Peripheral Device at the moment' });
  }
}

async function removePerpheral(req, res) {
  const { serialNumber, peripheralId } = req.params
  try {
    const peripheral = await peripheralService.removePeripheral(serialNumber, peripheralId)

    if (peripheral) {
      res.status(200).json({ message: `Peripheral ${peripheralId} deleted successfully` });
    }
    else {
      res.status(400).json({
        message: 'Could not remove Peripheral Device at the moment.'
      })
    }
  }
  catch (error) {
    console.error('GATEWAY_CONTROLLER_ERROR: removePerpheral ',error);
    res.status(500).json({ message: 'Could not remove Peripheral Device at the moment' });
  }
}


module.exports = {
  listAllGateways,
  createNewGateway,
  getGatewayBySerialNumber,
  createNewPeripheralDevice,
  removePerpheral
};
