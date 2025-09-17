require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// // Connect to MongoDB Atlas using environment variable
// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));




mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));



// Schema & Model
const MemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  membershipType: String,
  joinDate: { type: Date, default: Date.now },
});

const Member = mongoose.model("Member", MemberSchema);

// CRUD Routes

// CREATE Member
app.post("/members", async (req, res) => {
  try {
    console.log("👉 Body received:", req.body); // log body
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
