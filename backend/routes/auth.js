const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');

const auth = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate
} = require('../middleware/validation');
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', auth, getMe);
router.put('/profile', auth, validateProfileUpdate, updateProfile);

module.exports = router;
