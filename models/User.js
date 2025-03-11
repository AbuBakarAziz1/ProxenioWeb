import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    
{
    // Authentication & Role Management
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
    status: { type: String, enum: ["active", "inactive", "banned"], default: "inactive" },

    // Backend & System Fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Personal Information
    fullName: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number },
    phone: { type: String },

    // Location
    country: { type: String },
    city: { type: String },
    state: { type: String },

    // Additional Details
    religion: { type: String },
    education: { type: String },
    profession: { type: String },

    // Profile Information
    profilePicture: { type: String, default: "" },
    aboutMe: { type: String, maxlength: 500 },

    // Interests & Hobbies
    travelInterest: { type: [String], default: [] },
    hobbiesInterest: { type: [String], default: [] },

    // Video Introduction
    videoIntroduction: { type: String }, // URL to a video

    heartsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    heartsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }]

  },
  { timestamps: true } // Adds `createdAt` & `updatedAt` fields automatically
);

export default mongoose.models.User || mongoose.model("User", UserSchema);