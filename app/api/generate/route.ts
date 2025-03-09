import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"; // Ensure this import is correct

export async function POST(req: Request) {
  try {
    const authData = await auth(); // Await the auth function
    const { userId } = authData;   // Extract userId after awaiting

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Bad Request: Missing prompt", { status: 400 });
    }

    // Implement your logic here (e.g., calling an AI model)
    const response = { message: "AI response goes here", userId };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
