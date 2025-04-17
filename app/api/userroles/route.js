import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Received body:", body);

    const { id, username, role } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User role updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { id, ids } = body;

    if (id) {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "User deleted successfully" });
    }

    if (Array.isArray(ids) && ids.length > 0) {
      const result = await User.deleteMany({ _id: { $in: ids } });

      return NextResponse.json({
        message: `${result.deletedCount} user(s) deleted successfully`,
      });
    }

    return NextResponse.json({ error: "User ID(s) are required" }, { status: 400 });
  } catch (error) {
    console.error("DELETE Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
