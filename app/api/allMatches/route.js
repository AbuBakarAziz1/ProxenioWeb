import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const matches = await Match.find({ status: "matched" })
      .populate("senderId", "_id fullName")
      .populate("receiverId", "_id fullName")
      .sort({ matchedAt: -1 });

    const formattedMatches = matches.map((match) => ({
      matchId: match._id,
      user1Id: match.senderId._id,
      user2Id: match.receiverId._id,
      user1Name: match.senderId.fullName,
      user2Name: match.receiverId.fullName,
      matchDate: match.matchedAt,
      lastInteraction: match.updatedAt,
    }));

    return NextResponse.json({ success: true, matches: formattedMatches }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
