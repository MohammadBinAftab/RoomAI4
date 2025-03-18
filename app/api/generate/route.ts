import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const stylePrompts = {
  tropical: "Transform this room into a tropical paradise with lush plants, natural materials, and warm colors",
  modern: "Redesign this room with a modern aesthetic, clean lines, contemporary furniture, and a sophisticated color palette",
  minimalist: "Convert this room into a minimalist space with essential furniture, clean surfaces, and a neutral color scheme",
  industrial: "Transform this room with an industrial style, featuring exposed materials, metal accents, and urban elements",
  scandinavian: "Redesign this room in Scandinavian style with light woods, neutral colors, and cozy minimalist furniture"
};

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt,
          image: image,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      }
    );

    if (!Array.isArray(output) || output.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      url: output[0],
      generatedImage: output[0],
      originalImage: image,
      appliedStyle: style,
      prompt 
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
