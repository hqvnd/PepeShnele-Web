const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        minlength: [20, 'Description must be at least 20 characters'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['education', 'entertainment', 'sports', 'technology', 'business', 'arts', 'social', 'other']
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
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
    }],

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        ratedAt: {
            type: Date,
            default: Date.now
        }
    }],

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

// Calculate average rating before saving
eventSchema.pre('save', function(next) {
    if (this.ratings && this.ratings.length > 0) {
        const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.averageRating = (sum / this.ratings.length).toFixed(1);
    }
    next();
});

// Add indexes for better query performance
eventSchema.index({ eventDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Event', eventSchema);