import { auth } from "@clerk/nextjs/server"; // Not getAuth
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { getUserCredits, updateUserCredits } from "@/lib/supabase";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const stylePrompts = {
  tropical: "Transform this photo into a tropical paradise...",
  modern: "Redesign this photo with a modern aesthetic...",
  minimalist: "Convert this photo into a minimalist space...",
  industrial: "Transform this photo with an industrial style...",
  scandinavian: "Redesign this photo in Scandinavian style...",
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image, style } = await req.json();

    if (!style || !image) {
      return NextResponse.json(
        { error: "Missing style or image" },
        { status: 400 }
      );
    }

    const prompt = stylePrompts[style as keyof typeof stylePrompts];

    const output = await replicate.run(
      "adirik/t2i-adapter-sdxl-depth-midas:8a89b0ab59a050244a751b6475d91041a8582ba33692ae6fab65e0c51b700328",
      {
        input: {
          prompt,
          image,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          a_prompt:
            "best quality, extremely detailed, photo from Pinterest...",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers...",
        },
      }
    );

    if (!Array.isArray(output) || output.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    // Deduct credits from Supabase
    await updateUserCredits(
      userId,
      -1,
      "usage",
      `Room redesign - ${style} style`
    );

    return NextResponse.json({
      url: output[0],
      generatedImage: output[0],
      originalImage: image,
      appliedStyle: style,
      prompt,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
