const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Temporary storage (array instead of DB)
let attendanceData = [];

// POST
app.post("/api/attendance/mark", (req, res) => {
    const { name, status } = req.body;

    attendanceData.push({ name, status });

    res.json({ message: "Attendance saved successfully" });
});

// GET
app.get("/api/attendance", (req, res) => {
    res.json(attendanceData);
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});