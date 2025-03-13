import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req) {
    try {
        await connectDB();

        // Parse JSON data from request body
        const body = await req.json();
        const {
            _id,
            fullName,
            gender,
            age,
            phone,
            country,
            city,
            state,
            religion,
            education,
            profession,
            aboutMe,
            travelInterest,
            hobbiesInterest,
        } = body;

        if (!_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Ensure travelInterest and hobbiesInterest are arrays
        const travelInterestArray = Array.isArray(travelInterest)
            ? travelInterest
            : travelInterest?.split(",").map((item) => item.trim()) || [];

        const hobbiesInterestArray = Array.isArray(hobbiesInterest)
            ? hobbiesInterest
            : hobbiesInterest?.split(",").map((item) => item.trim()) || [];

        // Update user details in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            _id,
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
                travelInterest: travelInterestArray,
                hobbiesInterest: hobbiesInterestArray,
                updatedAt: Date.now(),
            },
            { new: true } // Return updated document
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
