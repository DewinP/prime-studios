"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailVerificationModal({ isOpen, onClose, email }: EmailVerificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Check Your Email
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We&apos;ve sent a verification email to:
            </p>
            <p className="font-medium text-foreground">{email}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the verification link to complete your registration.
          </p>
          <div className="pt-4">
            <Button onClick={onClose} className="w-full">
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 