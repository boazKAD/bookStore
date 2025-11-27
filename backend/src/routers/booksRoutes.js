import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "Please provide all fields" });
        }
        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResult.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id,
        });
        await newBook.save();
        return res.status(201).json(newBook);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/', protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profileImage');
        const totalBooks = await Book.countDocuments();
        return res.status(200).json({ books, currentPage: page, totalBooks, totalPages: Math.ceil(totalBooks / limit) });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/:id', protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('user', 'username profileImage');
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get recommended books by logged in user
router.get('/user', protectRoute, async (req, res) => {
    try {
        const userBooks = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ userBooks });
    } catch (error) {
        console.error("Error fetching user books:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }
        // delete image from cloudinary as well
        if (book.image && book.image.includes('cloudinary.com')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
        await book.remove();
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;