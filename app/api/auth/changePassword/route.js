import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, oldPassword, newPassword } = await req.json();

    // Basic validations
    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Find user and verify password
    const user = await User.findById(userId).select("+password"); // Ensure password field is selected
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect old password." }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Server error, try again later." }, { status: 500 });
  }
}
