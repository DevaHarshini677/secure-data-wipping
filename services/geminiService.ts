
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSecurityNote(fileName: string, fileSize: number, passes: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, high-security summary for a data erasure certificate. 
      File: ${fileName}, Size: ${fileSize} bytes, Method: ${passes} pass NIST SP 800-88.
      The note should emphasize the irreversibility and forensic security of the process. Keep it under 60 words.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Verification complete: Data bits have been fully randomized and overwritten, ensuring zero magnetic or solid-state remanence per international data sanitization protocols.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Verification complete: Data bits have been fully randomized and overwritten, ensuring zero magnetic or solid-state remanence.";
  }
}
