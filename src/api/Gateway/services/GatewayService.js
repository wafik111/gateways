const Gateway = require('../models/Gateway');

module.exports = {

  getGateways: async () => {
    return Gateway.find().populate('peripherals');
  },
  findGatewayBySerialNumber: async (serialNumber) => {
    return Gateway.findOne({ serialNumber }).populate('peripherals');
  },
  createGateway: async (gateway) => {
    const gatewayExists = await Gateway.exists({ serialNumber: gateway.serialNumber });
    if (gatewayExists) {
      let e = new Error(`Gateway ${gateway.serialNumber} already exists.`)
      e.code = 400;
      throw e;
    }
    const newGateway = new Gateway(gateway);
    await newGateway.save();

    return newGateway;
  },
};
