const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// connect DB
mongoose.connect("mongodb://127.0.0.1:27017/attendanceDB")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// routes
const attendanceRoutes = require("./routes/attendance");
app.use("/api/attendance", attendanceRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));