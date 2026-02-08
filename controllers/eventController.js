const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
exports.createEvent = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { category, search, date } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by date (upcoming or past)
    if (date === 'upcoming') {
      query.eventDate = { $gte: new Date() };
    } else if (date === 'past') {
      query.eventDate = { $lt: new Date() };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'username email')
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username')
      .populate('likes.user', 'username')
      .populate('ratings.user', 'username');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Make sure user is event owner or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Make sure user is event owner or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike event
// @route   POST /api/events/:id/like
// @access  Private
exports.likeEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if already liked
    const likeIndex = event.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      event.likes.splice(likeIndex, 1);
    } else {
      // Like
      event.likes.push({ user: req.user.id });
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Event unliked' : 'Event liked',
      likesCount: event.likes.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to event
// @route   POST /api/events/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    event.comments.unshift(comment);
    await event.save();

    await event.populate('comments.user', 'username');

    res.status(201).json({
      success: true,
      data: event.comments[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/events/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const comment = event.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    comment.deleteOne();
    await event.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like comment
// @route   POST /api/events/:id/comments/:commentId/like
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const comment = event.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user.id);
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate event
// @route   POST /api/events/:id/rate
// @access  Private
exports.rateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if event has passed
    if (new Date(event.eventDate) > new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot rate an event that has not occurred yet'
      });
    }

    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if user already rated
    const existingRatingIndex = event.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      event.ratings[existingRatingIndex].rating = rating;
      event.ratings[existingRatingIndex].ratedAt = Date.now();
    } else {
      // Add new rating
      event.ratings.push({
        user: req.user.id,
        rating
      });
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event rated successfully',
      averageRating: event.averageRating
    });
  } catch (error) {
    next(error);
  }
};