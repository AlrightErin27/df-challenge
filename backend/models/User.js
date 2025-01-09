const mongoose = require("mongoose");

//each user has a USERNAME, PS, EMAIL, LISTS (lists connects to another SCHEMA)

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
    // At least one character before the @:
    // .+ ensures there is at least one character before the @.
    // At least one character after the @ and before the .:
    // The second .+ ensures there is at least one character between the @ and the ..
    // . followed by at least one character:
    // The final .+ ensures there is a . followed by at least one character (e.g., .com).
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
