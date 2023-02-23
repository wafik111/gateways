const mongoose = require('mongoose')
// const transform = require('mongoose').transform
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gatewaySchema = new Schema({
  serialNumber: ObjectId,
  name: String,
  ipv4: String,
  peripherals: [{ type: ObjectId, ref: 'Peripheral' }]

},{
  toJSON: {
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

const Gateway = mongoose.model('Gateway', gatewaySchema);


module.exports = Gateway