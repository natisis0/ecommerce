import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


export async function createEmbedding(text) {
    const response = await genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [text],
        config: { outputDimensionality: 768 },
    });

    return response.embeddings[0].values;


}