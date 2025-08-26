const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const router = express.Router();

// Create storage paths if not exists
const ensureDir = dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
ensureDir('uploads/profile_pics');
ensureDir('uploads/other_pics');
ensureDir('data');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profile_pic')
      cb(null, 'uploads/profile_pics/');
    else
      cb(null, 'uploads/other_pics/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

function imageFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) cb(null, false);
  else cb(null, true);
}

const upload = multer({
  storage: storage,
  fileFilter: imageFilter
}).fields([
  { name: 'profile_pic', maxCount: 1 },
  { name: 'other_pics', maxCount: 5 }
]);

// Index/Register page
router.get('/', (req, res) => {
  res.render('register', { errors: [], data: {} });
});

// Register with validation + upload
router.post('/register',
  (req, res, next) => {
    upload(req, res, function (err) {
      req.multerError = err; // multer errors
      next();
    });
  },
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirm_password').custom((v, { req }) => v === req.body.password).withMessage('Passwords do not match'),
    body('gender').notEmpty().withMessage('Select gender'),
    body('hobbies').custom((value, { req }) => req.body.hobbies).withMessage('Pick at least 1 hobby')
  ],
  (req, res) => {
    let errors = validationResult(req).array();

    // Multer/image errors
    if (req.multerError) {
      errors.push({ msg: 'Image upload failed!' });
    } else if (!req.files.profile_pic || req.files.profile_pic.length === 0) {
      errors.push({ msg: 'Profile picture is required' });
    }

    // Cleanup partial uploads if error
    if (errors.length > 0) {
      if (req.files.profile_pic) req.files.profile_pic.forEach(f => fs.unlinkSync(f.path));
      if (req.files.other_pics) req.files.other_pics.forEach(f => fs.unlinkSync(f.path));
      return res.render('register', { errors, data: req.body });
    }

    // Save user data to a JSON for ZIP
    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: Array.isArray(req.body.hobbies) ? req.body.hobbies : [req.body.hobbies],
      profile_pic: req.files.profile_pic[0].filename,
      other_pics: req.files.other_pics ? req.files.other_pics.map(f => f.filename) : []
    };
    const jsonFile = `data/${Date.now()}_${userData.username}.json`;
    fs.writeFileSync(jsonFile, JSON.stringify(userData, null, 2));

    res.render('success', { data: userData, jsonPath: jsonFile });
  }
);

// Download an image
router.get('/download/:type/:filename', (req, res) => {
  let folder = req.params.type === "profile" ? "profile_pics" : "other_pics";
  const filePath = path.join(__dirname, `../uploads/${folder}/`, req.params.filename);
  res.download(filePath);
});

// Download all data as zip (JSON + images)
router.get('/downloadall/:username/:profilepic/:otherpics/:jsonfile', (req, res) => {
  const { username, profilepic, otherpics, jsonfile } = req.params;
  const archive = archiver('zip');
  const zipname = `${username}_data.zip`;

  res.attachment(zipname);

  archive.pipe(res);

  archive.file(path.join(__dirname, '../uploads/profile_pics/', profilepic), { name: `profile_${profilepic}` });
  if (otherpics !== 'none') {
    const pics = otherpics.split('&');
    pics.forEach(pic => {
      archive.file(path.join(__dirname, '../uploads/other_pics/', pic), { name: `other_${pic}` });
    });
  }
  archive.file(path.join(__dirname, '../', jsonfile), { name: `${username}_data.json` });

  archive.finalize();
});

module.exports = router;
