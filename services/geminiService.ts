
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Transaction, BusinessInsight } from "../types";

/**
 * Fetches business insights from Gemini AI based on current products and recent transactions.
 * Initializes GoogleGenAI within the function call to handle potential API key updates.
 */
export async function getBusinessInsights(products: Product[], transactions: Transaction[]): Promise<BusinessInsight> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const recentTransactions = transactions.slice(-20);

  const prompt = `
    Analyze this Sari-Sari store data:
    Products: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock, price: p.price })))}
    Recent Sales: ${JSON.stringify(recentTransactions.map(t => ({ total: t.total, items: t.items.map(i => i.name) })))}

    Provide a summary of performance and 3 actionable recommendations to increase profit or manage inventory.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "recommendations"]
        }
      }
    });

    // Directly access the .text property and ensure it's not undefined before parsing.
    const text = response.text?.trim() || "{}";
    return JSON.parse(text) as BusinessInsight;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return {
      summary: "Could not generate insights at this time.",
      recommendations: ["Manually check stock levels.", "Track your daily cash flow.", "Encourage digital payments."]
    };
  }
}