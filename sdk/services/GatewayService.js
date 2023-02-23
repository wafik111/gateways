const GatewayModel = require('../repositories/db/models/Gateway')
const pModel = require('../repositories/db/models/Peripheral')

module.exports = {

  getInvoiceSettings: async (req) => {
    try {
        return GatewayModel.find().populate('peripherals');
    } catch (e) {
      throw e;
    }
  },
  createGateway: async (req) => {
    // const reqSchema = req.headers['x-host'];
    // const schema = JSON.parse(await req.redis.get(subdomains))[reqSchema].subdomain;
    try {
        const todo = new GatewayModel(req.body);
            await todo.save();
      // const invoiceSettings = await req.models.invoiceSettings.createInvoiceSettings(schema, req.body);
      // return invoiceSettings;
    } catch (error) {
      throw error;
    }
  },
};
