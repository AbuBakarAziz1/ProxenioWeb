import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);

export async function PUT(req) {
  try {
    await connectDB();

    // Parse FormData from request
    const formData = await req.formData();

    // Extract fields from FormData
    const userId = formData.get("userId");
    const fullName = formData.get("fullName");
    const gender = formData.get("gender");
    const age = formData.get("age");
    const phone = formData.get("phone");
    const country = formData.get("country");
    const city = formData.get("city");
    const state = formData.get("state");
    const religion = formData.get("religion");
    const education = formData.get("education");
    const profession = formData.get("profession");
    const aboutMe = formData.get("aboutMe");
    const travelInterest = formData.get("travelInterest")?.split(",").map((item) => item.trim()) || [];
    const hobbiesInterest = formData.get("hobbiesInterest")?.split(",").map((item) => item.trim()) || [];

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let profilePictureUrl = null;
    let videoFileUrl = null;

    // Handle Profile Picture Upload
    const profilePhoto = formData.get("profilePhoto");
    if (profilePhoto && profilePhoto.name) {
      const profileExt = path.extname(profilePhoto.name);
      const profileFilename = `${userId}-profile-${Date.now()}${profileExt}`;
      const profileFilePath = path.join(process.cwd(), "public/uploads/profile", profileFilename);
      
      const profileBuffer = Buffer.from(await profilePhoto.arrayBuffer());
      await writeFileAsync(profileFilePath, profileBuffer);
      
      profilePictureUrl = `/uploads/profile/${profileFilename}`;
    }

    // Handle Video Upload
    const videoFile = formData.get("videoFile");
    if (videoFile && videoFile.name) {
      const videoExt = path.extname(videoFile.name);
      const videoFilename = `${userId}-video-${Date.now()}${videoExt}`;
      const videoFilePath = path.join(process.cwd(), "public/uploads/content", videoFilename);
      
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      await writeFileAsync(videoFilePath, videoBuffer);
      
      videoFileUrl = `/uploads/content/${videoFilename}`;
    }

    // Update User in Database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        gender,
        age,
        phone,
        country,
        city,
        state,
        education,
        religion,
        profession,
        aboutMe,
        travelInterest,
        hobbiesInterest,
        profilePicture: profilePictureUrl, // Update only if a new file is uploaded
        videoIntroduction: videoFileUrl, // Update only if a new video is uploaded
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
