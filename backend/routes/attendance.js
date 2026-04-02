const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Mark attendance
router.post("/mark", async (req, res) => {
    const { name, date, status } = req.body;

    const newRecord = new Attendance({ name, date, status });
    await newRecord.save();

    res.json({ message: "Attendance saved" });
});

// Get all attendance
router.get("/", async (req, res) => {
    const data = await Attendance.find();
    res.json(data);
});

module.exports = router;