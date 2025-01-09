const mongoose = require("mongoose");
//Each list belongs to a user
//each list has 1 date, 1 title, 1 boolean (true if all list's items booleans are true), 1-many items
// each item has text and a boolean

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
