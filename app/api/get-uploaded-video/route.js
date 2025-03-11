import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
    const userId = new URL(request.url).searchParams.get("userId");
  
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
  
    await connectDB(); // Connect to the database
  
    try {
      // Find the uploaded video URL for the user
      const user = await User.findById(userId);
  
      if (user && user.videoIntroduction) {
        return NextResponse.json({ videoUrl: user.videoIntroduction }, { status: 200 });
      }
  
      return NextResponse.json({ error: "No video found for this user" }, { status: 404 });
    } catch (error) {
      console.error("Error fetching video:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  