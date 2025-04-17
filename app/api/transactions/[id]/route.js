import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

// PUT update transaction
export async function PUT(req, context) {
  try {
    await connectDB();
    const { status, amount } = await req.json();
    const { id } = context.params;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { status, amount },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE transaction
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = context.params; 

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
