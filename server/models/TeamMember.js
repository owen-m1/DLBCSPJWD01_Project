const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  assignedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("TeamMember", TeamMemberSchema);
