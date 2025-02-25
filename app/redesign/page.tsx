"use client";


import { useEffect, useState } from "react";
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
import { CldUploadWidget } from "next-cloudinary";
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [image, setImage] = useState("");
  const [style, setStyle] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // ✅ Handle Successful Upload from CldUploadWidget
  const handleUploadSuccess = async (result: any) => {
    try {
      const uploadedUrl = result.info.secure_url;
      setImage(uploadedUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive",
      });
    }
  };

  // ✅ Manual Upload Fallback (if CldUploadWidget Fails)
  const handleManualUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setImage(data.secure_url);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  // ✅ AI Image Generation Function
  const handleGenerate = async () => {
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
          {/* Image Upload Section */}
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

            {/* Fallback Manual Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleManualUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline">Or Select File</Button>
            </label>
          </div>

          {/* Select Style */}
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

          {/* Select AI Model */}
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

          {/* Generate Button */}
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
