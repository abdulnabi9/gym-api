// Load environment variables
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Ensure MONGO_URL exists
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL environment variable is not set!");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    seedDatabase(); // Seed initial members
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Schema & Model
const MemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  membershipType: String,
  joinDate: { type: Date, default: Date.now },
});

const Member = mongoose.model("Member", MemberSchema);

// Seed sample members if collection is empty
async function seedDatabase() {
  const count = await Member.countDocuments();
  if (count === 0) {
    console.log("🌱 Seeding initial members...");
    const sampleMembers = [
      { name: "John Doe", email: "john@example.com", phone: "1234567890", membershipType: "Gold" },
      { name: "Jane Smith", email: "jane@example.com", phone: "0987654321", membershipType: "Silver" },
      { name: "Mike Johnson", email: "mike@example.com", phone: "1112223333", membershipType: "Platinum" }
    ];
    await Member.insertMany(sampleMembers);
    console.log("✅ Sample members added");
  }
}

// CRUD Routes

// CREATE Member
app.post("/members", async (req, res) => {
  try {
    console.log("👉 Body received:", req.body);
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error("❌ Error creating member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ All Members
app.get("/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error("❌ Error fetching members:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ Single Member
app.get("/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    member ? res.json(member) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    console.error("❌ Error fetching member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE Member
app.put("/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    member ? res.json(member) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    console.error("❌ Error updating member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE Member
app.delete("/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    member ? res.json({ message: "Member deleted" }) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    console.error("❌ Error deleting member:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
