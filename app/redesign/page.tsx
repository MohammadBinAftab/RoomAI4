"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';
import { useToast } from "@/components/ui/use-toast";

const styles = [
  { value: "tropical", label: "Tropical" },
  { value: "modern", label: "Modern" },
  { value: "minimalist", label: "Minimalist" },
  { value: "industrial", label: "Industrial" },
  { value: "scandinavian", label: "Scandinavian" },
];

const models = [
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "dall-e", label: "DALL-E 2" },
];

export default function RedesignPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [image, setImage] = useState("");
  const [style, setStyle] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (result: any) => {
    setImage(result.info.secure_url);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const handleGenerate = async () => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    if (!image || !style || !model) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, style, model }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setImage(data.url);
      
      toast({
        title: "Success",
        description: "Your room has been redesigned!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Redesign Your Room</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo and let AI transform your space
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col items-center gap-4">
            {image ? (
              <img
                src={image}
                alt="Room"
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <Button
                    onClick={() => open()}
                    className="h-[200px] w-full"
                    variant="outline"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Room Photo
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>

          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Design"}
          </Button>
        </div>
      </div>
    </div>
  );
}