import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    transactionType: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
