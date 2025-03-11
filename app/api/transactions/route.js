import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find();

    const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);
    const pending = transactions.filter((t) => t.status === "Pending").reduce((sum, t) => sum + t.amount, 0);
    const inReview = transactions.filter((t) => t.status === "In Review").reduce((sum, t) => sum + t.amount, 0);

    return Response.json({ transactions, totalEarnings, pending, inReview });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId, name, amount, date, source, status } = await req.json();

    const newTransaction = new Transaction({ userId, name, amount, date, source, status });
    await newTransaction.save();

    return Response.json({ message: "Transaction added successfully", transaction: newTransaction }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
