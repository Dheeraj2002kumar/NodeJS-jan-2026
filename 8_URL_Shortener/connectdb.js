const mongoose = require('mongoose');

async function connectToMongoDB(url) {
    try {
        await mongoose.connect(url);  // Removed the deprecated options
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  // Exit the process if MongoDB connection fails
    }
}

module.exports = connectToMongoDB;
