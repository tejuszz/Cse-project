const mongoose = require("mongoose");

// Schema
const attendanceSchema = new mongoose.Schema({
    name: String,
    status: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Attendance", attendanceSchema);