"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { uploadService } from "@/lib/upload-service";
import { useUserAuth } from "@/lib/use-user-auth";
import { FileUpload } from "@/components/ui/file-upload";
import { api } from "@/trpc/react";
import { supabase } from "@/lib/supabase";

interface UploadTrackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (trackData: UploadTrackData) => void;
}

export interface UploadTrackData {
  name: string;
  artist: string;
  description: string;
  status: string;
  audioFile: File | null;
  duration: number;
  audioUrl?: string;
  signedUrl?: string;
  prices: { licenseType: string; price: number }[];
}

// Add license options
const LICENSE_OPTIONS = [
  { label: "MP3 Lease", value: "mp3_lease" },
  { label: "WAV Lease", value: "wav_lease" },
  { label: "WAV Trackout Lease", value: "wav_trackout_lease" },
  { label: "Unlimited Lease", value: "unlimited_lease" },
  { label: "Exclusive", value: "exclusive" },
];

export function UploadTrackModal({
  isOpen,
  onOpenChange,
  onUpload,
}: UploadTrackModalProps) {
  const { user } = useUserAuth();
  const createTrackMutation = api.track.create.useMutation({
    onSuccess: () => {
      // Refetch tracks after successful creation
      // This will update the dashboard automatically
    },
    onError: (error) => {
      setUploadError(error.message);
    },
  });
  const [formData, setFormData] = useState<UploadTrackData>({
    name: "",
    artist: "",
    description: "",
    status: "draft",
    audioFile: null,
    duration: 0,
    prices: [{ licenseType: "mp3_lease", price: 0 }],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Add state for prices
  const [prices, setPrices] = useState([
    { licenseType: "mp3_lease", price: 0, displayPrice: "0.00" }, // price is stored in cents
  ]);

  const handleAudioFileChange = (file: File) => {
    setFormData({ ...formData, audioFile: file });

    // Get audio duration
    const audio = new Audio();
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      const durationInSeconds = Math.round(audio.duration);
      setFormData((prev) => ({ ...prev, duration: durationInSeconds }));
    };

    audio.onerror = () => {
      console.warn("Could not load audio metadata for duration");
    };

    // Create object URL and load metadata
    const objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;

    // Clean up object URL after metadata is loaded
    audio.onloadedmetadata = () => {
      const durationInSeconds = Math.round(audio.duration);
      setFormData((prev) => ({ ...prev, duration: durationInSeconds }));
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handlePriceChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setPrices((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const handleAddPrice = () => {
    setPrices((prev) => [
      ...prev,
      { licenseType: "mp3_lease", price: 0, displayPrice: "0.00" },
    ]); // price is stored in cents
  };

  const handleRemovePrice = (index: number) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.audioFile) {
      setUploadError("Please select an audio file");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadResult = await uploadService.uploadAudioFile(
        formData.audioFile,
        user?.id ?? "",
      );

      if (!uploadResult.success || !uploadResult.url) {
        setUploadError(uploadResult.error ?? "Upload failed");
        return;
      }

      const trackData = {
        name: formData.name,
        artist: formData.artist,
        description: formData.description || "",
        duration: formData.duration,
        audioUrl: `${supabase.storage.from("tracks").getPublicUrl(uploadResult.url).data.publicUrl}`,
        status: formData.status as "draft" | "published",
        prices: prices.map(({ ...p }) => ({
          licenseType: p.licenseType,
          price: Number(p.price),
        })),
      };

      const createdTrack = await createTrackMutation.mutateAsync(trackData);

      if (createdTrack) {
        onUpload({
          ...formData,
          audioUrl: uploadResult.url,
          signedUrl: uploadResult.signedUrl,
        });

        handleReset();
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      artist: "",
      description: "",
      status: "draft",
      audioFile: null,
      duration: 0,
      prices: [{ licenseType: "mp3_lease", price: 0 }],
    });
    setPrices([{ licenseType: "mp3_lease", price: 0, displayPrice: "0.00" }]);
    setUploadError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Upload New Track
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Track Name */}
          <div>
            <Label htmlFor="track-name" className="text-foreground">
              Track Name *
            </Label>
            <Input
              id="track-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-background border-border text-foreground"
              placeholder="Enter track name"
              required
            />
          </div>

          {/* Artist */}
          <div>
            <Label htmlFor="artist" className="text-foreground">
              Artist *
            </Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) =>
                setFormData({ ...formData, artist: e.target.value })
              }
              className="bg-background border-border text-foreground"
              placeholder="Enter artist name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-background border-border text-foreground"
              placeholder="Enter track description"
              rows={3}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-foreground">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: string) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audio File Upload */}
          <FileUpload
            onFileSelect={handleAudioFileChange}
            onFileRemove={() =>
              setFormData({ ...formData, audioFile: null, duration: 0 })
            }
            selectedFile={formData.audioFile}
            accept="audio/*"
            maxSize={50}
            label="Audio File *"
            description="Click to upload audio file or drag and drop"
            error={uploadError ?? undefined}
            disabled={isUploading}
          />

          {/* Duration Display */}
          {formData.duration > 0 && (
            <div className="text-muted-foreground text-sm">
              Duration: {Math.floor(formData.duration / 60)}:
              {(formData.duration % 60).toString().padStart(2, "0")}
            </div>
          )}

          {/* Price Options */}
          <div>
            <Label className="text-foreground">Price Options *</Label>
            <div className="space-y-2">
              {prices.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Select
                    value={p.licenseType}
                    onValueChange={(val) =>
                      handlePriceChange(i, "licenseType", val)
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {LICENSE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={p.displayPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      const dollarAmount = parseFloat(value) || 0;
                      const centsAmount = Math.round(dollarAmount * 100);
                      handlePriceChange(i, "displayPrice", value);
                      handlePriceChange(i, "price", centsAmount);
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      const dollarAmount = parseFloat(value) || 0;
                      const formattedValue = dollarAmount.toFixed(2);
                      handlePriceChange(i, "displayPrice", formattedValue);
                    }}
                    className="bg-background border-border text-foreground w-28"
                    placeholder="Price ($)"
                    required
                  />
                  {prices.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemovePrice(i)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddPrice}
                className="mt-2"
              >
                + Add Price Option
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-border text-foreground"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
              disabled={
                !formData.name ||
                !formData.artist ||
                !formData.audioFile ||
                isUploading
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Track"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
