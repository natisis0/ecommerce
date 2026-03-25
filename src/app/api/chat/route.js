import { NextResponse } from "next/server";
import { createEmbedding } from "@/_lib/ai/embedding";
import { createClient } from "@/_lib/supabase-server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].text.toLowerCase();

    let productContext = "No specific database products requested.";

    // Always search Supabase for context
    const queryEmbedding = await createEmbedding(latestMessage);

    const { data: matchedProducts, error: dbError } = await supabase.rpc('match_products', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5
    });

    if (dbError) throw dbError;

    if (matchedProducts && matchedProducts.length > 0) {
      productContext = "Here are some related products from our database:\n\n";
      matchedProducts.forEach(product => {
        productContext += `- ${product.name} (Price: $${product.price})\n  Description: ${product.description}\n\n`;
      });
    } else {
      productContext = "We couldn't find any exact products matching that description, but try to answer anyway or suggest browsing.";
    }

    const systemInstruction = `
      You are an expert, friendly sales AND customer support assistant for our E-commerce store.
      Your goal is to have natural conversations, help customers find products, and answer support questions.

      ABOUT THIS APP (PORTFOLIO PROJECT):
      This ecommerce application is a portfolio project created by Natnael Sisay (natnaesisay4@gmail.com) to demonstrate advanced full-stack web development abilities and cutting-edge AI integration skills. If a user asks about the app's creation, your capabilities, or the developer, feel free to proudly explain that this project showcases both frontend/backend engineering and AI RAG (Retrieval-Augmented Generation) skills!

      STORE POLICIES (Use this to answer support questions):
      1. Returns: We accept returns within 30 days of purchase. Items must be unused.
      2. Shipping: Free shipping on orders over $50. Otherwise, flat rate of $5.99. Delivery takes 3-5 business days.
      3. Support Hours: Monday to Friday, 9 AM to 5 PM EST.
      4. Contact: Users can email natnaesisay4@gmail.com for further help.

      PRODUCT SEARCH RULES:
      Below are products retrieved from our database based on the user's latest message. 
      If the user is looking to buy something, recommend these products naturally. 
      Only recommend products if they are explicitly listed in the DATABASE CONTEXT. If no products are found, or the user is just saying hello or asking about a policy, DO NOT hallucinate products. Be a friendly assistant and answer directly or suggest browsing if they have a specific need we couldn't match.

      DATABASE CONTEXT:
      ${productContext}
    `;

    const formattedHistory = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));
 

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    return NextResponse.json({ reply: response.text , products: matchedProducts});

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
