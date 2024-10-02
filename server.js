const express = require('express');
const multer = require('multer');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML, CSS, JS

// AWS S3 Configuration
const s3 = new S3Client({
    region: '',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});

// Multer configuration for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const uploadParams = {
        Bucket: 'prathamesh-bucket', // Replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);
        res.json({ success: true, message: 'File uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// Download route
app.get('/download', async (req, res) => {
    const fileName = req.query.fileName;
    const getParams = {
        Bucket: 'prathamesh-bucket',
        Key: fileName
    };

    try {
        const command = new GetObjectCommand(getParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL valid for 1 hour
        res.json({ success: true, url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Download failed' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
