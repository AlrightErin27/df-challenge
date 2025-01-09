const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  checkedItem: {
    type: Boolean,
    default: false,
  },
});

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  items: [ItemSchema],
  checkedList: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("List", ListSchema);
