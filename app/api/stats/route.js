import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const [totalUsers, activeUsers, matchedUsers, maleUsers, femaleUsers, users] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: "active" }),
            User.countDocuments({ isMatched: true }),
            User.countDocuments({ gender: /male/i }),
            User.countDocuments({ gender: /female/i }),
            User.find({}, { city: 1 }),
        ]);

        // Count occurrences of each city
        const cityCounts = users.reduce((acc, user) => {
            if (user.city) {
                acc[user.city] = (acc[user.city] || 0) + 1;
            }
            return acc;
        }, {});

        // Convert to percentage
        const topCities = Object.entries(cityCounts)
            .map(([name, count]) => ({
                name,
                percentage: Math.round((count / totalUsers) * 100), // Convert to percentage
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5); // Top 5 cities

        return NextResponse.json({
            totalUsers,
            activeUsers,
            matchedUsers,
            maleUsers,
            femaleUsers,
            revenue: [500, 800, 1200, 900, 1500, 1600, 2000, 1700, 1900, 2500, 3000, 2800],
            topCities,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
