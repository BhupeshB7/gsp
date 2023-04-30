const express = require('express');
const multer = require('multer');
const router = express.Router();
const Deposit = require('../models/Deposit');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, transactionId, userID } = req.body;
    const imagePath = req.file.path;

    // Check if the uploaded file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error('File not found');
    }

    const user = new Deposit({ name, transactionId, userID, image: imagePath });
    await user.save();
    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
//for get user data
router.get('/users', async (req, res) => {
    try {
      const users = await Deposit.find();
      res.json(users);
    }
     catch (error) {
      console.error(error);
      res.status(500).json({ message});
    };
});
module.exports = router;
