const multer = require('multer');

const upload = multer({
    // Store files in memory as buffer for immediate processing (like AI analysis)
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
        