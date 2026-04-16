const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
    subject: String,
    type: String, // Theory / Lab / Tute
    title: String,
    link: String,
    category: String, // lecture or notes
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Material", materialSchema);