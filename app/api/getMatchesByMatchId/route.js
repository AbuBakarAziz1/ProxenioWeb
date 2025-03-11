import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    // Extract matchId from request URL
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
    }

    // Find the match by matchId
    const match = await Match.findById(matchId);

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Fetch sender and receiver user details
    const sender = await User.findById(match.senderId).select(
      "fullName profilePicture country aboutMe status phone email age gender city"
    );
    const receiver = await User.findById(match.receiverId).select(
      "fullName profilePicture country aboutMe status phone email age gender city"
    );

    if (!sender || !receiver) {
      return NextResponse.json({ error: "User details not found" }, { status: 404 });
    }

    return NextResponse.json({ sender, receiver, match }, { status: 200 });

  } catch (error) {
    console.error("Error fetching match details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
