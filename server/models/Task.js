const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
