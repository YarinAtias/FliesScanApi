const express = require('express');
const router = express.Router();
const fileController = require('../controller/fController');
const multer = require('multer');
const path = require('path');

// הגדרת אחסון הקבצים
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files', fileController.getFiles);
router.get('/:id', fileController.getFileById);
module.exports = router;
