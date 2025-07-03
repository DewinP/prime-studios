"use client";

import { z } from "zod";
import { uploadFile, getSignedUrl, STORAGE_BUCKETS } from "./supabase";

// File upload response schema
export const uploadResponseSchema = z.object({
  success: z.boolean(),
  url: z.string().optional(),
  signedUrl: z.string().optional(),
  error: z.string().optional(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;

// File validation schemas
export const audioFileSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(50 * 1024 * 1024), // 50MB
  allowedTypes: z
    .array(z.string())
    .default(["audio/mpeg", "audio/wav", "audio/flac", "audio/mp3"]),
});

export const imageFileSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z
    .array(z.string())
    .default(["image/jpeg", "image/png", "image/webp"]),
});

export type AudioFileInput = z.infer<typeof audioFileSchema>;
export type ImageFileInput = z.infer<typeof imageFileSchema>;

// File validation functions
export function validateAudioFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const result = audioFileSchema.safeParse({ file });

  if (!result.success) {
    return { valid: false, error: "Invalid file format" };
  }

  const { file: audioFile, maxSize, allowedTypes } = result.data;

  if (audioFile.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    };
  }

  if (!allowedTypes.includes(audioFile.type)) {
    return {
      valid: false,
      error: "Invalid audio file type. Please use MP3, WAV, or FLAC",
    };
  }

  return { valid: true };
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const result = imageFileSchema.safeParse({ file });

  if (!result.success) {
    return { valid: false, error: "Invalid file format" };
  }

  const { file: imageFile, maxSize, allowedTypes } = result.data;

  if (imageFile.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    };
  }

  if (!allowedTypes.includes(imageFile.type)) {
    return {
      valid: false,
      error: "Invalid image file type. Please use JPG, PNG, or WebP",
    };
  }

  return { valid: true };
}

// Generate unique filename
export function generateUniqueFilename(
  originalName: string,
  userId: string,
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

// Upload service class
export class UploadService {
  async uploadAudioFile(file: File, userId: string): Promise<UploadResponse> {
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const filename = generateUniqueFilename(file.name, userId);
    const result = await uploadFile(STORAGE_BUCKETS.AUDIO, filename, file);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Get signed URL for the uploaded file
    const signedUrl = await getSignedUrl(STORAGE_BUCKETS.AUDIO, filename);

    return {
      success: true,
      url: filename, // Store the path in database
      signedUrl: signedUrl ?? undefined,
    };
  }

  async getSignedUrl(
    bucket: string,
    filePath: string,
    expiresIn = 3600,
  ): Promise<UploadResponse> {
    try {
      const signedUrl = await getSignedUrl(bucket, filePath, expiresIn);

      if (!signedUrl) {
        return { success: false, error: "Failed to get signed URL" };
      }

      return { success: true, signedUrl };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get signed URL",
      };
    }
  }
}

// Default upload service instance
export const uploadService = new UploadService();
