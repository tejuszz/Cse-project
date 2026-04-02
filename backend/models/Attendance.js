const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    name: String,
    date: String,
    status: String // Present / Absent
});

module.exports = mongoose.model("Attendance", attendanceSchema);