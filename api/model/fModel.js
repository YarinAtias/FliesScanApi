const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    filepath: String, // הנתיב המלא כולל השרת והפורט
    uploadedAt: { type: Date, default: Date.now },
    isInfected: { type: Boolean, default: false } // שדה חדש
});

module.exports = mongoose.model('File', fileSchema);
