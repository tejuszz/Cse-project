const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const Attendance = require("./Attendance");
const Material = require("./Material");

const app = express();

app.use(cors());
app.use(express.json());

/* ===== CONNECT TO MONGODB ===== */
mongoose.connect("mongodb://127.0.0.1:27017/attendanceDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ===== SERVE UPLOADED FILES ===== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== MULTER CONFIG ===== */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

/* ===== ATTENDANCE ===== */
app.post("/api/attendance/mark", async (req, res) => {
    try {
        const { name, status } = req.body;

        const newRecord = new Attendance({ name, status });
        await newRecord.save();

        res.json({ message: "Attendance saved successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/attendance", async (req, res) => {
    try {
        const data = await Attendance.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/attendance/:id", async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===== STUDY MATERIAL (LINK) ===== */
app.post("/api/materials/add", async (req, res) => {
    try {
        const { subject, type, title, link, category } = req.body;

        const newMaterial = new Material({
            subject,
            type,
            title,
            link,
            category
        });

        await newMaterial.save();

        res.json({ message: "Material added successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===== STUDY MATERIAL (FILE UPLOAD) ===== */
app.post("/api/materials/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("FILE RECEIVED:", req.file); // 🔥 DEBUG

        const { subject, type, title, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const newMaterial = new Material({
            subject,
            type,
            title,
            link: req.file.filename, // store filename
            category
        });

        await newMaterial.save();

        res.json({ message: "File uploaded successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/* ===== GET MATERIALS ===== */
app.get("/api/materials", async (req, res) => {
    try {
        const { subject, type } = req.query;

        const data = await Material.find({ subject, type });

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===== START SERVER ===== */
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
app.delete("/api/materials/:id", async (req, res) => {
    console.log("DELETE HIT:", req.params.id);
    try {
        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/api/materials/:id", async (req, res) => {
    const { title } = req.body;

    await Material.findByIdAndUpdate(req.params.id, { title });

    res.json({ message: "Updated" });
});