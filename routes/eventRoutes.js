const express = require('express');
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  likeEvent,
  addComment,
  deleteComment,
  likeComment,
  rateEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const eventValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5-200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20-5000 characters'),
  body('category')
    .isIn(['education', 'entertainment', 'sports', 'technology', 'business', 'arts', 'social', 'other'])
    .withMessage('Invalid category'),
  body('eventDate')
    .isISO8601()
    .withMessage('Event date must be a valid date'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1-1000 characters')
];

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (authentication required)
router.post('/', protect, authorize('admin'), eventValidation, validate, createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

// Social interaction routes (authentication required)
router.post('/:id/like', protect, likeEvent);
router.post('/:id/comments', protect, commentValidation, validate, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.post('/:id/comments/:commentId/like', protect, likeComment);
router.post('/:id/rate', protect, rateEvent);

module.exports = router;