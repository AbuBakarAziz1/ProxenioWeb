import { put } from "@vercel/blob";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  await connectDB(); // Connect to MongoDB

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File size exceeds 50MB limit" }), { status: 400 });
    }

    const extension = file.name.split(".").pop();
    const filename = `${userId}-${Date.now()}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(`videos/${filename}`, file, {
      access: "public",
      token: process.env.Prox_READ_WRITE_TOKEN, // Explicitly pass the token
    });

    if (!blob.url) {
      return new Response(JSON.stringify({ error: "File upload failed" }), { status: 500 });
    }

    // Update MongoDB with the Blob URL
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { videoIntroduction: blob.url },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "File uploaded successfully", videoUrl: blob.url }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }), {
      status: 500,
    });
  }
}
