const Gateway = require('../models/Gateway');

module.exports = {

  getGateways: async () => {
    return Gateway.find().populate('peripherals');
  },
  findGatewayBySerialNumber: async (serialNumber) => {
    return Gateway.findOne({ serialNumber }).populate('peripherals');
  },
  createGateway: async (gateway) => {
    const newGateway = new Gateway(gateway);
    await newGateway.save();

    return newGateway;
  },
};
