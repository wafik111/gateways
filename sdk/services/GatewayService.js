const GatewayModel = require('../repositories/db/models/Gateway')
const pModel = require('../repositories/db/models/Peripheral')

module.exports = {

  getGateways: async (req) => {
    try {
        return GatewayModel.find().populate('peripherals');
    } catch (e) {
      throw e;
    }
  },
  fetshGateway: async (serialNumber) => {
    try {
        return GatewayModel.findOne({ serialNumber }).populate('peripherals');
    } catch (e) {
      throw e;
    }
  },
  createGateway: async (req) => {
    try {
        const gateway = new GatewayModel(req.body);
            await gateway.save();

    } catch (error) {
      throw error;
    }
  },
};
