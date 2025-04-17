import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { ids } = await req.json(); // expect an array of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
    }

    const result = await Transaction.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: `${result.deletedCount} transaction(s) deleted`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
