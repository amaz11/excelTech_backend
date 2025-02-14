const { default: mongoose } = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;