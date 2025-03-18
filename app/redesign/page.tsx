"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
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

export default function RedesignPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return <p>Redirecting to sign-in...</p>;
  }

  const handleUploadSuccess = async (result: any) => {
    try {
      const uploadedUrl = result.info.secure_url;
      setOriginalImage(uploadedUrl);
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

  const handleManualUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "room-redesign");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcbzyjj0e/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setOriginalImage(data.secure_url);

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

  const handleGenerate = async () => {
    if (!originalImage || !style) {
      toast({
        title: "Error",
        description: "Please upload an image and select a style",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalImage, style }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setGeneratedImage(data.generatedImage);

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
    <div className="container mx-auto max-w-6xl py-10">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Redesign Your Room</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo and let AI transform your space
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Image Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Original Room</h2>
            <div className="flex flex-col items-center gap-4">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Original Room"
                  className="w-full aspect-video rounded-lg object-cover"
                />
              ) : (
                <CldUploadWidget
                  uploadPreset="room-redesign"
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <Button
                      onClick={() => open()}
                      className="h-[300px] w-full"
                      variant="outline"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Room Photo
                    </Button>
                  )}
                </CldUploadWidget>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleManualUpload(e.target.files[0])
                }
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline">Or Select File</Button>
              </label>
            </div>
          </div>

          {/* Generated Image Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Redesigned Room</h2>
            <div className="flex flex-col gap-4">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Redesigned Room"
                  className="w-full aspect-video rounded-lg object-cover"
                />
              ) : (
                <div className="h-[300px] w-full rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Generated image will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* Style Selection */}
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select room style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={loading || !originalImage || !style}
          >
            {loading ? "Generating..." : "Generate Design"}
          </Button>
        </div>
      </div>
    </div>
  );
}
