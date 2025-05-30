const mongoose = require('mongoose');

// write for me sample for this schema 
const restaurant = {
    "name": "test",
    "address": "test",
    "district": "Yunusobod",
    "capacity": 10,
    "pricePerSeat": 10,
    "phone": "test",
    "owner": "678d2c4b3c4b3c4b3c4b3c4b",
    "status": "pending",
    "images": []
}

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true,
        enum: ['Yunusobod', 'Yakkasaroy', 'Mirobod', 'Mirzo-Ulugbek', 'Olmos', 'Sergeli', 'Shaykhantaur', 'Uchtepa', 'Yashnobod', 'Chilonzor']
    },
    capacity: {
        type: Number,
        required: true
    },
    pricePerSeat: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
