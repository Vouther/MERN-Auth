import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        console.log("Error connecting to MongoDB: ", e.message);
        process.exit(1); // Sale del proceso si hay error en la conexión
    }
};