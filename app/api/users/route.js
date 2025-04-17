import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  await connectDB();
  
  // Extract user session using getToken()
  const token = await getToken({ req, secret });
  // if (!token || token.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  // }

  const users = await User.find().select("-password"); // Exclude password field
  return NextResponse.json(users);
}

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



export async function DELETE(req) {
  await connectDB();

  // const token = await getToken({ req, secret });
  // if (!token || token.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  // }

  const { userIds } = await req.json();

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: "No users selected for deletion" }, { status: 400 });
  }

  const result = await User.deleteMany({ _id: { $in: userIds } });

  return NextResponse.json({
    message: "Users deleted successfully",
    deletedCount: result.deletedCount
  });
}