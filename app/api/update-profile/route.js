import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import { put } from "@vercel/blob";

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

    // Get the Vercel Blob token from environment variables
    const BLOB_TOKEN = process.env.Prox_READ_WRITE_TOKEN;

    if (!BLOB_TOKEN) {
      return NextResponse.json({ error: "Vercel Blob token is missing" }, { status: 500 });
    }

    // Upload Profile Photo to Vercel Blob
    const profilePhoto = formData.get("profilePhoto");
    if (profilePhoto && profilePhoto.name) {
      const profileExt = profilePhoto.name.split(".").pop();
      const profileFilename = `profile/${userId}-profile-${Date.now()}.${profileExt}`;

      const profileBlob = await put(profileFilename, profilePhoto, {
        access: "public",
        token: BLOB_TOKEN, // Explicitly pass the token
      });

      profilePictureUrl = profileBlob.url; // Store the Blob URL
    }

     // Upload Video File to Vercel Blob
     const videoFile = formData.get("videoFile");
     if (videoFile && videoFile.name) {
       const videoExt = videoFile.name.split(".").pop();
       const videoFilename = `videos/${userId}-video-${Date.now()}.${videoExt}`;
 
       const videoBlob = await put(videoFilename, videoFile, {
         access: "public",
         token: BLOB_TOKEN,
       });
 
       videoFileUrl = videoBlob.url;
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
