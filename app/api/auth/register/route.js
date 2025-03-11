import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try { 
    await connectDB();

    // Parse the incoming request data
    const { username, role, email, password } = await req.json();

    // Validation: Ensure that all fields are provided
    if (!username || !role || !email || !password) {
      return Response.json(
        { error: "All fields (name, email, password, role) are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Return success response
    return Response.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    // Enhanced error handling
    if (error.name === "MongoError" && error.code === 11000) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Log the error for debugging
    console.error("Error registering user:", error);

    // Return generic error message
    return Response.json(
      { error: "Error registering user, please try again later" },
      { status: 500 }
    );
  }
}
