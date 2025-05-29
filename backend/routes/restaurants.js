const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ status: 'approved' });
        res.json(restaurants);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/', [ upload.array('images', 5)], async (req, res) => {
    try {
        const { name, address, district, capacity, pricePerSeat, phone, owner } = req.body;

        const restaurant = new Restaurant({
            name,
            address,
            district,
            capacity,
            pricePerSeat,
            phone,
            owner,
            images: req.files ? req.files.map(file => file.path) : []
        });

        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', [upload.array('images', 5)], async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        // Check if user is admin or owner
        if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { name, address, district, capacity, pricePerSeat, phone } = req.body;

        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.district = district || restaurant.district;
        restaurant.capacity = capacity || restaurant.capacity;
        restaurant.pricePerSeat = pricePerSeat || restaurant.pricePerSeat;
        restaurant.phone = phone || restaurant.phone;
        restaurant.images = req.files ? req.files.map(file => file.path) : restaurant.images;

        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        res.status(500).send('Server error');
    }
});
router.put('/:id/status', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { status } = req.body;
        restaurant.status = status;
        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
