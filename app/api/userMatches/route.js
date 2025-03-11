import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { senderId, receiverId } = await req.json();

    // Check if sender and receiver are the same user
    if (senderId === receiverId) {
      return NextResponse.json({ error: "You cannot send a heart to yourself." }, { status: 400 });
    }

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if the match already exists
    const existingMatch = await Match.findOne({ senderId, receiverId });

    if (existingMatch) {
      return NextResponse.json({ message: "Request already sent" }, { status: 400 });
    }

    // Check if receiver has already sent a request to the sender (Mutual Match)
    const mutualMatch = await Match.findOne({
      senderId: receiverId,
      receiverId: senderId,
      status: "pending",
    });

    if (mutualMatch) {
      // Update the existing match to "matched"
      await Match.findByIdAndUpdate(mutualMatch._id, { status: "matched", matchedAt: new Date() });

      // Create a new "matched" entry for sender
      const newMatch = await Match.create({
        senderId,
        receiverId,
        status: "matched",
        matchedAt: new Date(),
      });

      // Update both users' match lists
      await User.findByIdAndUpdate(senderId, { $push: { matches: newMatch._id } });
      await User.findByIdAndUpdate(receiverId, { $push: { matches: newMatch._id } });

      // Update heartsSent and heartsReceived for both users when a match is made
      await User.findByIdAndUpdate(senderId, { $push: { heartsSent: newMatch._id } });
      await User.findByIdAndUpdate(receiverId, { $push: { heartsReceived: newMatch._id } });

      return NextResponse.json({ success: true, message: "It's a match!", match: newMatch }, { status: 201 });
    }

    // Otherwise, create a "pending" match request
    const newMatch = await Match.create({
      senderId,
      receiverId,
      status: "pending",
    });

    // Update heartsSent and heartsReceived for both users
    await User.findByIdAndUpdate(senderId, { $push: { heartsSent: newMatch._id } });
    await User.findByIdAndUpdate(receiverId, { $push: { heartsReceived: newMatch._id } });

    return NextResponse.json({ success: true, match: newMatch }, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
