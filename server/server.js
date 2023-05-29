const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import Task and TeamMember models
const Task = require("./models/Task");
const TeamMember = require("./models/TeamMember");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/easytaskmanager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Endpoints for tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  await task.populate("assignedTo");

  // Find the team member and update their assignedTasks
  await TeamMember.findByIdAndUpdate(
    task.assignedTo,
    { $push: { assignedTasks: task._id } },
    { new: true }
  );

  res.json(task);
});

app.put("/api/tasks/:id", async (req, res) => {
  const oldTask = await Task.findById(req.params.id);
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("assignedTo");

  // If the assignee has changed, update both the old and new team members' assignedTasks
  if (oldTask.assignedTo.toString() !== updatedTask.assignedTo.toString()) {
    await TeamMember.findByIdAndUpdate(
      oldTask.assignedTo,
      { $pull: { assignedTasks: oldTask._id } },
      { new: true }
    );
    await TeamMember.findByIdAndUpdate(
      updatedTask.assignedTo,
      { $push: { assignedTasks: updatedTask._id } },
      { new: true }
    );
  }

  res.json(updatedTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  await Task.findByIdAndDelete(req.params.id);

  // Update the team member's assignedTasks
  await TeamMember.findByIdAndUpdate(
    task.assignedTo,
    { $pull: { assignedTasks: task._id } },
    { new: true }
  );

  res.json({ message: "Task deleted" });
});

// API Endpoints for team members
app.get("/api/teamMembers", async (req, res) => {
  const teamMembers = await TeamMember.find().populate("assignedTasks");
  res.json(teamMembers);
});

app.post("/api/teamMembers", async (req, res) => {
  const teamMember = new TeamMember(req.body);
  await teamMember.save();
  res.json(teamMember);
});

app.put("/api/teamMembers/:id", async (req, res) => {
  const teamMember = await TeamMember.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(teamMember);
});

app.delete("/api/teamMembers/:id", async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ message: "Team Member deleted" });
});

// Continue with API endpoints for team members

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
