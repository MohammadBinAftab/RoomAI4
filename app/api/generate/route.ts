import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Assuming useCredits is a hook or function that returns { credits, useCredits }
// You need to import or define this function
import { useCredits } from './path/to/useCredits'; // Replace with actual path

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req); // Correct usage for Next.js App Router

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Bad Request: Missing prompt", { status: 400 });
    }

    // Use the useCredits function to get the user's credits and the function to use credits
    const { credits, useCredits: useUserCredits } = useCredits(userId);

    // Check if the user has sufficient credits
    if (credits.available_credits >= 1) {
      // Attempt to use one credit
      const success = await useUserCredits(1, 'Generated room design');

      if (success) {
        // Generate the image here
        // For demonstration, let's assume you have a function generateImage(prompt)
        const generatedImage = await generateImage(prompt); // Implement generateImage function

        const response = { message: "Image generated successfully", userId, image: generatedImage };
        return NextResponse.json(response, { status: 200 });
      } else {
        // Handle failure to use credits
        return new NextResponse("Failed to use credits", { status: 500 });
      }
    } else {
      // Handle insufficient credits
      return new NextResponse("Insufficient credits", { status: 402 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Example function to generate an image (you need to implement this based on your actual image generation logic)
async function generateImage(prompt) {
  // Your image generation logic here
  // For example, using a library or API to generate an image based on the prompt
  return "Generated image URL or data"; // Replace with actual implementation
}
