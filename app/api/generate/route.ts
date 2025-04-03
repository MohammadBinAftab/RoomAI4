import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
//import { authOptions } from "@/lib/auth"; // Ensure this import exists
import Replicate from "replicate";
import { supabase } from "@/lib/supabase";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const stylePrompts: Record<string, string> = {
  tropical: "Transform this room into a tropical paradise with lush plants, natural materials, and warm colors.",
  modern: "Redesign this room with a modern aesthetic, clean lines, contemporary furniture, and a sophisticated color palette.",
  minimalist: "Convert this room into a minimalist space with essential furniture, clean surfaces, and a neutral color scheme.",
  industrial: "Transform this room with an industrial style, featuring exposed materials, metal accents, and urban elements.",
  scandinavian: "Redesign this room in Scandinavian style with light woods, neutral colors, and cozy minimalist furniture."
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(); // Get logged-in user session
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { image, style } = await req.json();

    if (!image || !style) {
      return NextResponse.json(
        { error: "Missing required fields: image and style" },
        { status: 400 }
      );
    }

    // Validate style key
    if (!stylePrompts[style]) {
      return NextResponse.json(
        { error: "Invalid style. Choose from: tropical, modern, minimalist, industrial, scandinavian." },
        { status: 400 }
      );
    }

    const prompt = stylePrompts[style];

    // Define input for Replicate API
    const input = {
      image,
      prompt,
      scheduler: "K_EULER_ANCESTRAL",
      num_samples: 1,
      guidance_scale: 7.5,
      negative_prompt: "anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured",
      num_inference_steps: 30,
      adapter_conditioning_scale: 1,
      adapter_conditioning_factor: 1
    };

    // Call Replicate API
    const output = await replicate.run(
      "adirik/t2i-adapter-sdxl-depth-midas:8a89b0ab59a050244a751b6475d91041a8582ba33692ae6fab65e0c51b700328",
      { input }
    );

    if (!Array.isArray(output) || output.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate image. Replicate API returned an empty response." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image generated successfully",
      generatedImage: output[0],
      originalImage: image,
      appliedStyle: style,
      prompt
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
