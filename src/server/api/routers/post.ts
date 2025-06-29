import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  getLatest: publicProcedure.query(() => {
    return {
      id: "1",
      title: "Latest Post",
      content: "This is the latest post content",
      createdAt: new Date(),
    };
  }),
});
