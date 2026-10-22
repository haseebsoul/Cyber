const mongoose = require("mongoose");

// Connect the backend to MongoDB using the URL from .env
const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URI;

        if (!mongoURL) {
            throw new Error("MONGO_URI is missing from the .env file.");
        }

        await mongoose.connect(mongoURL);

        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
