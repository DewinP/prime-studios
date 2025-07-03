"use client";

import * as React from "react";
import { useCallback, useState, useRef } from "react";
import { Upload, X, FileAudio, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  label?: string;
  description?: string;
  error?: string | null;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = "audio/*",
  maxSize = 50,
  className,
  label = "Upload File",
  description = "Click to upload or drag and drop",
  error,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (accept && !file.type.match(accept.replace("*", ".*"))) {
        return `File type not supported. Please upload a ${accept} file.`;
      }

      // Check file size
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `File size must be less than ${maxSize}MB.`;
      }

      return null;
    },
    [accept, maxSize],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setDragError(validationError);
        return;
      }

      setDragError(null);
      onFileSelect(file);
    },
    [validateFile, onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      setDragError(null);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(() => {
    onFileRemove?.();
    setDragError(null);
  }, [onFileRemove]);

  const displayError = error ?? dragError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-foreground text-sm font-medium">{label}</Label>
      )}

      <div
        className={cn(
          "border-border bg-muted/50 relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed transition-colors",
          isDragOver && "border-primary bg-primary/5",
          selectedFile && "border-green-500/50 bg-green-500/5",
          disabled && "cursor-not-allowed opacity-50",
          displayError && "border-destructive/50 bg-destructive/5",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() =>
          !selectedFile && !disabled && fileInputRef.current?.click()
        }
      >
        {selectedFile ? (
          <div className="flex w-full items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <FileAudio className="h-8 w-8 text-green-600" />
              <div className="flex flex-col">
                <span className="text-foreground font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-muted-foreground text-sm">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="text-muted-foreground mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm font-medium">
              {description}
            </p>
            <p className="text-muted-foreground text-xs">
              {accept === "audio/*"
                ? "MP3, WAV, FLAC up to 50MB"
                : `Max size: ${maxSize}MB`}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {displayError && (
        <div className="text-destructive flex items-center space-x-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
