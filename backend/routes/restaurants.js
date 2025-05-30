const express = require("express")
const router = express.Router()
const Restaurant = require("../models/Restaurant")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")
const fs = require('fs')

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// @desc    Get all restaurants (admin view: all statuses) or approved restaurants (public view)
// @route   GET /api/restaurants
// @access  Public (for approved) or Admin (for all)
router.get("/", auth, async (req, res) => {
  try {
    let query;

    // Check if the user is an admin
    if (req.user && req.user.role === 'admin') {
      // Admin gets all restaurants
      query = Restaurant.find().populate('owner', 'fullName username'); // Populate owner details
    } else {
      // Non-admins (public) only get approved restaurants
      query = Restaurant.find({ status: "approved" }).populate('owner', 'fullName username'); // Populate owner details
    }

    const restaurants = await query.exec(); // Execute the query
    res.json(restaurants)
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).json({ message: 'To\'yxonalarni yuklashda xatolik yuz berdi' })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: "To'yxona topilmadi" })
    }
    res.json(restaurant)
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    res.status(500).json({ message: 'To\'yxonani yuklashda xatolik yuz berdi' })
  }
})

router.post("/", [auth, upload.array("images", 5)], async (req, res) => {
  try {
    const { name, address, district, capacity, pricePerSeat, phone } = req.body

    // Validate required fields
    if (!name || !address || !district || !capacity || !pricePerSeat || !phone) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" })
    }

    // Validate district
    const validDistricts = ['Yunusobod', 'Yakkasaroy', 'Mirobod', 'Mirzo-Ulugbek', 'Olmos', 'Sergeli', 'Shaykhantaur', 'Uchtepa', 'Yashnobod', 'Chilonzor']
    if (!validDistricts.includes(district)) {
      return res.status(400).json({ message: "Noto'g'ri tuman" })
    }

    // Validate numeric fields
    if (isNaN(capacity) || isNaN(pricePerSeat)) {
      return res.status(400).json({ message: "Sig'uvchanlik va narx raqam bo'lishi kerak" })
    }

    const restaurant = new Restaurant({
      name,
      address,
      district,
      capacity: Number(capacity),
      pricePerSeat: Number(pricePerSeat),
      phone,
      owner: req.user.id,
      images: req.files ? req.files.map((file) => file.path) : [],
    })

    await restaurant.save()
    res.json(restaurant)
  } catch (err) {
    console.error('Error creating restaurant:', err);
    res.status(500).json({ message: 'To\'yxona qo\'shishda xatolik yuz berdi' })
  }
})

router.put("/:id", [auth, upload.array("images", 5)], async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: "To'yxona topilmadi" })
    }

    // Check if user is admin or owner
    if (req.user.role !== "admin" && restaurant.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Ruxsat rad etildi" })
    }

    const { name, address, district, capacity, pricePerSeat, phone } = req.body

    // Validate district if provided
    if (district) {
      const validDistricts = ['Yunusobod', 'Yakkasaroy', 'Mirobod', 'Mirzo-Ulugbek', 'Olmos', 'Sergeli', 'Shaykhantaur', 'Uchtepa', 'Yashnobod', 'Chilonzor']
      if (!validDistricts.includes(district)) {
        return res.status(400).json({ message: "Noto'g'ri tuman" })
      }
    }

    restaurant.name = name || restaurant.name
    restaurant.address = address || restaurant.address
    restaurant.district = district || restaurant.district
    restaurant.capacity = capacity ? Number(capacity) : restaurant.capacity
    restaurant.pricePerSeat = pricePerSeat ? Number(pricePerSeat) : restaurant.pricePerSeat
    restaurant.phone = phone || restaurant.phone
    restaurant.images = req.files ? req.files.map((file) => file.path) : restaurant.images

    await restaurant.save()
    res.json(restaurant)
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(500).json({ message: 'To\'yxonani yangilashda xatolik yuz berdi' })
  }
})

router.put("/:id/status", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: "To'yxona topilmadi" })
    }

    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Ruxsat rad etildi" })
    }

    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Noto'g'ri status" })
    }

    restaurant.status = status
    await restaurant.save()
    res.json(restaurant)
  } catch (err) {
    console.error('Error updating restaurant status:', err);
    res.status(500).json({ message: 'To\'yxona statusini yangilashda xatolik yuz berdi' })
  }
})

// Delete restaurant
router.delete("/:id", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: "To'yxona topilmadi" })
    }

    // Check if user is admin or owner
    if (req.user.role !== "admin" && restaurant.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Ruxsat rad etildi" })
    }

    // Delete restaurant images from uploads folder
    if (restaurant.images && restaurant.images.length > 0) {
      restaurant.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      })
    }

    // Delete restaurant from database
    await Restaurant.findByIdAndDelete(req.params.id)
    
    res.json({ message: "To'yxona muvaffaqiyatli o'chirildi" })
  } catch (err) {
    console.error('Error deleting restaurant:', err)
    res.status(500).json({ message: 'To\'yxonani o\'chirishda xatolik yuz berdi' })
  }
})

module.exports = router
