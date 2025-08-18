const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
    description: { type: String, required: true },
  deadline: { type: Date, required: true },
  assignedDate: { type: Date, default: Date.now },
  file: { type: String }, // store file path or URL
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference to User (intern)
  status: { type: String, enum: ["Ongoing", "Completed", "Pending"], default: "Ongoing" }});

module.exports = mongoose.model("Task", taskSchema);
