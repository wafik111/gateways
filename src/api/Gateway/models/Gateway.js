const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gatewaySchema = new Schema({
  serialNumber: { type: String, required: true, unique: true },
  name: {type: String},
  ipv4: {type: String},
  peripherals: [{ type: ObjectId, ref: 'Peripheral' }]

}, {
  toJSON: {
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

// gatewaySchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' })

const Gateway = mongoose.model('Gateway', gatewaySchema);

module.exports = Gateway