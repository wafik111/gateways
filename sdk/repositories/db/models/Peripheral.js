const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const peripheralSchema = new Schema({
  uid: {
    type: Number,
    required: true,
    unique: true
  },
  vendor: String,
  date:{
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum : ['online','offline'],
    default: 'online'
},
gateway: { type: ObjectId, ref: 'Gateway' }
},{
    toJSON: {
        versionKey: false,
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
        }
      }
});

const Peripheral = mongoose.model('Peripheral', peripheralSchema);

module.exports = Peripheral;
