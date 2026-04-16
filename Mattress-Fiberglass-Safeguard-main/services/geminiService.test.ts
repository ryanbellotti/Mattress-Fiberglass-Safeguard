import { test, expect, mock } from "bun:test";
import { checkBrandWithSearch } from "./geminiService";
import { GoogleGenAI } from "@google/genai";

mock.module("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: async (opts: any) => {
          return {
            text: "High risk, contains fiberglass. " + JSON.stringify(opts),
            candidates: [{ groundingMetadata: { groundingChunks: [] } }]
          };
        }
      };
    }
  };
});

process.env.API_KEY = "test";

test("checkBrandWithSearch separates instruction from user data", async () => {
  const result = await checkBrandWithSearch("SafeBrand");
  expect(result.summary).toContain("SafeBrand");
});
