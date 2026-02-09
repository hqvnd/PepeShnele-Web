// models/Announcement(Alihan)

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        minlength: [20, 'Content must be at least 20 characters'],
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Social Features
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);