import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Replicate from "replicate";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const stylePrompts = {
  tropical:
    "Transform this photo into a tropical paradise with lush plants, natural materials, and warm colors",
  modern:
    "Redesign this photo with a modern aesthetic, clean lines, contemporary furniture, and a sophisticated color palette",
  minimalist:
    "Convert this photo into a minimalist space with essential furniture, clean surfaces, and a neutral color scheme",
  industrial:
    "Transform this photo with an industrial style, featuring exposed materials, metal accents, and urban elements",
  scandinavian:
    "Redesign this photo in Scandinavian style with light woods, neutral colors, and cozy minimalist furniture",
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(); // Get logged-in user session
    if (!session || !session.user?.email) {
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
      "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d",
      {
        input: {
          prompt,
          image: image,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          a_prompt:
            "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
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
