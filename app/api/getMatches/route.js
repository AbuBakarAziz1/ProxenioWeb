import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match"
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }


    const user = await User.findById(userId)
      .populate("heartsSent", "receiverId")
      .populate("heartsReceived", "senderId")
      .populate("matches", "senderId receiverId");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get details of sent and received hearts
    const sentHearts = await User.find({ _id: { $in: user.heartsSent.map((h) => h.receiverId) } })
      .select("fullName profilePicture country aboutMe status phone");

    const receivedHearts = await User.find({ _id: { $in: user.heartsReceived.map((h) => h.senderId) } })
      .select("fullName profilePicture country aboutMe status phone");

    const matches = await User.find({
      _id: {
        $in: user.matches.flatMap((m) => [m.senderId, m.receiverId]),
        $ne: user._id  // Exclude the current user's profile
      }
    }).select("fullName profilePicture country aboutMe status phone");

    return NextResponse.json({ sentHearts, receivedHearts, matches }, { status: 200 });

  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
