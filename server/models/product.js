const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    type: String,
    name: String,
    photo: String,
    brand: String,
    description: String,
    ingredients: String,
    price: Number,
    date: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
