const router = require('express').Router();
const { updateProfile } = require('../controllers/profile.controller');
const { uploadImage } = require('../libs/multer');
const tokenVerify = require('../middlewares/tokenVerify');

router.put('/update', tokenVerify, uploadImage.single('image'), updateProfile);

module.exports = router;