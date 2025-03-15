import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  await connectDB();

  try {
    const { userId, videoUrl } = await request.json();

    if (!userId || !videoUrl) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { videoIntroduction: videoUrl },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Video URL saved successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Failed to save video URL" }), { status: 500 });
  }
}
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  await connectDB();

  try {
    const { userId, videoUrl } = await request.json();

    if (!userId || !videoUrl) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { videoIntroduction: videoUrl },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Video URL saved successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Failed to save video URL" }), { status: 500 });
  }
}
