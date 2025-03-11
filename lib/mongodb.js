import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in the .env file");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI)
            .then((mongoose) => {
                return mongoose;
            })
            .catch((error) => {
                console.error("MongoDB connection error:", error);
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
export default connectDB;