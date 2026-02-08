const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteEvents');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite event
// @route   POST /api/users/favorites/:eventId
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.eventId;

    const index = user.favoriteEvents.indexOf(eventId);
    
    if (index > -1) {
      // Remove from favorites
      user.favoriteEvents.splice(index, 1);
    } else {
      // Add to favorites
      user.favoriteEvents.push(eventId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: index > -1 ? 'Event removed from favorites' : 'Event added to favorites',
      data: user.favoriteEvents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorite events
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favoriteEvents',
      populate: { path: 'createdBy', select: 'username' }
    });

    res.status(200).json({
      success: true,
      count: user.favoriteEvents.length,
      data: user.favoriteEvents
    });
  } catch (error) {
    next(error);
  }
};