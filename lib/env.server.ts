import { z } from "zod";
import { clientEnv } from "./env.client";

const serverEnvSchema = z.object({
  
});

const serverOnly = serverEnvSchema.parse({

});

export const serverEnv = {
  ...clientEnv,
  ...serverOnly,
};
