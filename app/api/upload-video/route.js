import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  await connectDB(); // Connect to MongoDB

  const formData = await request.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  
  const buffer = Buffer.from(await file.arrayBuffer());
  //const filename = `${Date.now()}-${file.name}`;
  const extension = path.extname(file.name); // Get file extension
  const filename = `${userId}-${Date.now()}${extension}`; // Unique filename

  const filePath = path.join(process.cwd(), "public/uploads/content", filename);

  try {
    fs.writeFileSync(filePath, buffer); // Save the file locally
    const fileUrl = `/uploads/content/${filename}`; // Store relative path
    
    // Update the specific user’s videoIntroduction field
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { videoIntroduction: fileUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "File uploaded successfully", filename });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}