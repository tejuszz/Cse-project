const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Attendance = require("./Attendance"); // 🔥 import schema

const app = express();

app.use(cors());
app.use(express.json());

/* ===== CONNECT TO MONGODB ===== */
mongoose.connect("mongodb://127.0.0.1:27017/attendanceDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


/* ===== POST (SAVE DATA) ===== */
app.post("/api/attendance/mark", async (req, res) => {
    try {
        const { name, status } = req.body;

        const newRecord = new Attendance({
            name,
            status
        });

        await newRecord.save();

        res.json({ message: "Attendance saved successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* ===== GET ALL RECORDS ===== */
app.get("/api/attendance", async (req, res) => {
    try {
        const data = await Attendance.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* ===== DELETE RECORD ===== */
app.delete("/api/attendance/:id", async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* ===== START SERVER ===== */
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});