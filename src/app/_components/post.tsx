"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Post() {
  return (
    <div className="w-full max-w-xs">
      <p className="text-foreground truncate">Your most recent post: </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2"
      >
        <Input
          type="text"
          placeholder="Title"
          className="border-border bg-muted/50 border"
        />
        <Button type="submit" className="font-semibold">
          submit
        </Button>
      </form>
    </div>
  );
}
