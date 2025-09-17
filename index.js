// index.js
require('dotenv').config(); // Load .env first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Railway provides PORT

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// Mongoose Schema & Model
const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  membershipType: String,
  joinDate: { type: Date, default: Date.now },
});

const Member = mongoose.model("Member", memberSchema);

// Routes

// Test route
app.get("/", (req, res) => res.send("API is running"));

// CREATE member
app.post("/members", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error("❌ Error creating member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ all members
app.get("/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error("❌ Error fetching members:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ single member
app.get("/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    member ? res.json(member) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    console.error("❌ Error fetching member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE member
app.put("/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    member ? res.json(member) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    console.error("❌ Error updating member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE member
app.delete("/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    member ? res.json({ message: "Member deleted" }) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    console.error("❌ Error deleting member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
