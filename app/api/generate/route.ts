import { NextResponse } from "next/server";
import Replicate from "replicate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { image, style, model } = await req.json();

    // Here you would check user credits and deduct one credit
    // Implementation depends on your database choice

    let output;
    if (model === "stable-diffusion") {
      output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            image,
            prompt: `Transform this room into a ${style} style room`,
            negative_prompt: "bad quality, blurry",
          },
        }
      );
    }

    return NextResponse.json({ url: output });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}