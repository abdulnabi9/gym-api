const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Connect to MongoDB Atlas (replace with your connection string)
mongoose.connect("mongodb://127.0.0.1:27017/gymdb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

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

// // CREATE Member
// app.post("/members", async (req, res) => {
//   try {
//     const member = new Member(req.body);
//     await member.save();
//     res.status(201).json(member);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });





app.post("/members", async (req, res) => {
  try {
    console.log("👉 Body received:", req.body); // 👈 log body here

    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});







// READ All Members
app.get("/members", async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

// READ Single Member
app.get("/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    member ? res.json(member) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE Member
app.put("/members/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    member ? res.json(member) : res.status(404).json({ error: "Not Found" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Member
app.delete("/members/:id", async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
