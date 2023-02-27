const Gateway = require('../../Gateway/models/Gateway')
const Peripheral = require('../models/Peripheral')

module.exports = {

  createPeripheral: async (peripheral, gatewaySerialNumber) => {
    const gateway = await Gateway.findOne({ serialNumber: gatewaySerialNumber });
    if (!gateway) {
      let e = new Error(`Couldn't find Gateway with SN ${gatewaySerialNumber}`);
      e.code = 400;
      e.type = 'GW_NOT_FOUND';
      throw e;
    }
    if (gateway.peripherals.length == 10) {
      let e =  new Error(`Maximum Peripheral devices reached on Gateway ${gatewaySerialNumber}`);
      e.code = 400;
      e.type = 'MAX_DEVICE_NUM';
      throw e;
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
