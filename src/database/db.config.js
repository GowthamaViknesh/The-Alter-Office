import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "ShortenerUrl",
        });
        console.log(`MongoDB connected to ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error while connecting to the database: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb