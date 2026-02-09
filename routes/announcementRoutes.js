const express = require('express');
const { body } = require('express-validator');
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  likeAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const announcementValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5-200 characters'),
  body('content')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Content must be between 20-5000 characters')
];

// Public routes
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

// Protected routes (Admin only for CRUD)
router.post('/', protect, authorize('admin'), announcementValidation, validate, createAnnouncement);
router.put('/:id', protect, authorize('admin'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

// Social interaction (authentication required)
router.post('/:id/like', protect, likeAnnouncement);

module.exports = router;