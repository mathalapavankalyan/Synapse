import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ActionPlan {
  category: "Medical" | "Disaster" | "Safety" | "Logistics" | "Other";
  urgency: "Low" | "Medium" | "High" | "Critical";
  summary: string;
  structuredData: {
    key: string;
    value: string;
  }[];
  immediateActions: string[];
  verifiedResources: {
    name: string;
    contact?: string;
    link?: string;
  }[];
}

export const processIntent = async (input: string, imageBase64?: string): Promise<ActionPlan> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are OmniBridge, a universal intent-to-action engine for societal benefit.
    Analyze the provided input (text and/or image) which may be messy, unstructured, or real-world data (medical history, disaster photo, traffic report, etc.).
    
    Convert this into a structured, life-saving action plan.
    
    Rules:
    1. Identify the category and urgency.
    2. Extract key structured data points.
    3. Provide clear, immediate actions.
    4. Suggest verified resources or types of resources needed.
  `;

  const contents: any[] = [{ text: input || "Analyze this input for societal benefit." }];
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(",")[1] || imageBase64,
      },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents.map(c => typeof c === 'string' ? { text: c } : c) },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ["Medical", "Disaster", "Safety", "Logistics", "Other"] },
          urgency: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
          summary: { type: Type.STRING },
          structuredData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                key: { type: Type.STRING },
                value: { type: Type.STRING }
              },
              required: ["key", "value"]
            }
          },
          immediateActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          verifiedResources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                contact: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["name"]
            }
          }
        },
        required: ["category", "urgency", "summary", "structuredData", "immediateActions", "verifiedResources"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
