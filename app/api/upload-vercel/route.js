import { put } from "@vercel/blob";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  await connectDB(); // Connect to MongoDB

  const formData = await request.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file || !userId) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  try {
    const extension = file.name.split(".").pop();
    const filename = `${userId}-${Date.now()}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(`videos/${filename}`, file, {
        access: "public",
        token: process.env.Prox_READ_WRITE_TOKEN, // Pass the token explicitly
      });

    
    // Update MongoDB with the Blob URL
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { videoIntroduction: blob.url },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "File uploaded successfully", videoUrl: blob.url }), { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500 });
  }
}
