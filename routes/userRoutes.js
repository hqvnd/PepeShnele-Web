const express = require('express');
const {
  getProfile,
  updateProfile,
  toggleFavorite,
  getFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/favorites/:eventId', toggleFavorite);
router.get('/favorites', getFavorites);

module.exports = router;