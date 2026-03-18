import { z } from "zod";
import { clientEnv } from "./env.client";

const serverEnvSchema = z.object({
  openaiApiKey: z.string().min(1),
});

const serverOnly = serverEnvSchema.parse({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export const serverEnv = {
  ...clientEnv,
  ...serverOnly,
};
