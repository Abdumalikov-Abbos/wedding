const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    blacklisted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster token lookups
tokenSchema.index({ token: 1 }, { unique: true });

tokenSchema.methods.isExpired = function() {
    return this.expiresAt < new Date();
};

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
