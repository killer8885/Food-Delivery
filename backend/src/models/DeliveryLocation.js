const mongoose = require('mongoose');

const deliveryLocationSchema = new mongoose.Schema({
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { lat: Number, lng: Number },
  heading: Number,
}, { timestamps: true });

module.exports = mongoose.model('DeliveryLocation', deliveryLocationSchema);
