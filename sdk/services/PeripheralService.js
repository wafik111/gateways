const GatewayModel = require('../repositories/db/models/Gateway')
const Peripheral = require('../repositories/db/models/Peripheral')

module.exports = {

  createPeripheral: async (req) => {
    try {
        const { uid, vendor, date, status } = req.body;
        const { serialNumber } = req.params

        const gateway = await GatewayModel.findOne({ serialNumber });
        if (gateway.peripherals.length == 2){
          return false
        }
        const peripheral = new Peripheral({ uid, vendor, date, status , gateway: gateway._id});
        await peripheral.save();
        gateway.peripherals.push(peripheral);
        gateway.save()

    } catch (error) {
      throw error;
    }
  },
  removePeripheral: async (serialNumber, peripheralId ) => {
    try{
     await GatewayModel.updateOne({ serialNumber}  ,{ $pull: { peripherals: peripheralId } });
      //remove from the array 
     const result = await Peripheral.deleteOne({_id: peripheralId})
     console.log(result)
      return true
    } catch (error){
      throw error
    }
  }
};
