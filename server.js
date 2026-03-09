const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Setup middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.single('image'), (re, res) => {
    if (!re.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `images/${re.file.filename}`;
    res.json({ imageUrl });
});

app.post('/save-config', (req, res) => {
    const config = req.body;
    fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(config, null, 2));
    res.send('Config saved.');
});

app.get('/config', (req, res) => {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        res.json(JSON.parse(fs.readFileSync(configPath)));
    } else {
        res.status(404).send('Config not found.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Images will be saved to: ${imagesDir}`);
});
