import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";


export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await User.findById(session.user.id).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const fullName = formData.get("fullName");
    const password = formData.get("password");
    const profilePhoto = formData.get("profilePhoto");

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update full name
    if (fullName) {
      user.fullName = fullName;
    }

    // Update password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Upload profile photo to Vercel Blob
    if (profilePhoto && profilePhoto.name) {
      const profileExt = profilePhoto.name.split(".").pop();
      const profileFilename = `profile/${user._id}-profile-${Date.now()}.${profileExt}`;

      const profileBlob = await put(profileFilename, profilePhoto, {
        access: "public",
        token: process.env.BLOB_TOKEN,
      });

      user.profilePicture = profileBlob.url; 
    }

    await user.save();
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
