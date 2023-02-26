const Gateway = require('../../Gateway/models/Gateway')
const Peripheral = require('../models/Peripheral')

module.exports = {

  createPeripheral: async (peripheral, gatewaySerialNumber) => {
    const gateway = await Gateway.findOne({ serialNumber: gatewaySerialNumber });
    if (!gateway) {
      throw new Error(`Couldn't find Gateway with SN ${gatewaySerialNumber}`);
    }
    if (gateway.peripherals.length == 10) {
      throw new Error(`Maximum Peripheral devices reached on Gateway ${gatewaySerialNumber}`);
    }
    const newPeripheral = new Peripheral({ ...peripheral, gateway: gateway._id });
    await newPeripheral.save();

    gateway.peripherals.push(newPeripheral);
    await gateway.save();

    return newPeripheral;
  },

  removePeripheral: async (serialNumber, peripheralId) => {
    await Gateway.updateOne({ serialNumber }, { $pull: { peripherals: peripheralId } });
    const result = await Peripheral.deleteOne({ _id: peripheralId })
    console.log('Removing Peripheral result: ', result)
    return true
  }
};
