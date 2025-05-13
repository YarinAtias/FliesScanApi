const File = require('../model/fModel');
const path = require('path');
const NodeClam = require('clamscan');


const initClamScan = async () => {
    const clamscan = await new NodeClam().init({
        clamscan: {
            path: 'C:\\Users\\ירין אטיאס\\Desktop\\clamav-1.0.8.win.win32\\clamscan.exe',  // הנתיב המלא ל-clamscan במערכת שלך
        }
    });
    return clamscan;
}


exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const clamscan = await initClamScan();
        const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        const { isInfected, file, viruses } = await clamscan.isInfected(path.join('C:/Users/ירין אטיאס/Desktop/all/NodeJs/FilesApi',`/public/uploads/${req.file.filename}`));

        console.log(isInfected, file, viruses); // הוספת הדפסת לוג לפלט

        if (isInfected) {
            return res.status(400).json({ error: 'File is infected', viruses });
        }

        const newFile = new File({
            filename: req.file.filename,
            filepath: fileUrl ,
            isInfected
        });

        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', file: newFile });

    } catch (err) {
        console.error('Error in file upload:', err); // הוספת הדפסת שגיאה בצד השרת
        res.status(500).json({ error: 'Error uploading file', details: err.message });
    }
};


exports.getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching files', details: err.message });
    }
};
exports.getFileById = async (req, res) => {
    try {
        const { id } = req.params; // קבלת מזהה הקובץ מה-URL
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json(file);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching file', details: err.message });
    }
};

