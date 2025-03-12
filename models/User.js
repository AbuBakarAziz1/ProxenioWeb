import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Authentication & Role Management
    username: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, enum: ["admin", "moderator", "user"], default: "user", index: true },
    status: { type: String, enum: ["active", "inactive", "banned"], default: "inactive", index: true },

    // Personal Information
    fullName: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, min: 13, max: 120 },
    phone: { type: String, match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number"] }, // Supports international format

    // Location
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },

    // Additional Details
    religion: { type: String, trim: true },
    education: { type: String, trim: true },
    profession: { type: String, trim: true },

    // Profile Information
    profilePicture: { type: String, default: "" },
    aboutMe: { type: String, maxlength: 500, trim: true },

    // Interests & Hobbies
    travelInterest: { type: [String], default: [], trim: true },
    hobbiesInterest: { type: [String], default: [], trim: true },

    // Video Introduction
    videoIntroduction: { type: String }, // URL to a video

    // Match System
    heartsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    heartsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
  },
  { timestamps: true } // Adds `createdAt` & `updatedAt` fields automatically
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
