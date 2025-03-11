import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  await connectDB();
  
  // Extract user session using getToken()
  const token = await getToken({ req, secret });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await User.find().select("-password"); // Exclude password field
  return NextResponse.json(users);
}

// ✅ Update User Role (Admin Only)
export async function PUT(req) {
  await connectDB();

  // Extract user session using getToken()
  const token = await getToken({ req, secret });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, newRole } = await req.json();
  const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

  return NextResponse.json({ message: "User role updated successfully", updatedUser });
}
