const GatewayModel = require('../repositories/db/models/Gateway')
const Peripheral = require('../repositories/db/models/Peripheral')

module.exports = {

  createPeripheral: async (req) => {
    // const reqSchema = req.headers['x-host'];
    // const schema = JSON.parse(await req.redis.get(subdomains))[reqSchema].subdomain;
    try {
        const { uid, vendor, date, status } = req.body;
        const { serialNumber } = req.params
        const gateway = await GatewayModel.findOne({ serialNumber });
        console.log('gateway', gateway)


        const peripheral = new Peripheral({ uid, vendor, date, status , gateway: gateway._id});
        await peripheral.save();

    } catch (error) {
      throw error;
    }
  },
};
