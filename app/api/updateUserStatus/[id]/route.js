import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
