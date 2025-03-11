import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "matched"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
    matchedAt: { type: Date, default: null }
});

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);
