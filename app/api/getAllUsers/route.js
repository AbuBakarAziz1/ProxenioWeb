import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get session to identify current user
    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch verified users excluding the current user
    const users = await User.find({
      status: "active", 
    });

    // Return JSON response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
