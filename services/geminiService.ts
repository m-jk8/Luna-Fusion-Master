
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Item } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateItemName = async (item1: Item, item2: Item): Promise<string> => {
    const prompt = `You are a creative game designer called "The Fusion Master". Your task is to invent a new, fun, and whimsical name for an object created by fusing two other objects. The name should be short, catchy, and no more than 3 words. Respond ONLY with the name you've invented. Do not add any explanation, quotation marks, or preamble.

Fusion ingredients are: "${item1.name}" and "${item2.name}".`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Error generating item name:", error);
        return "Mysterious Fusion";
    }
};

const generateItemImage = async (itemName: string, item1: Item, item2: Item): Promise<string> => {
    const isLunaInvolved = item1.id === 'luna' || item2.id === 'luna';
    const basePrompt = isLunaInvolved
        ? `A funny, cute, photorealistic, cinematic image of a pug named Luna experiencing the concept: "${itemName}". This concept is a fusion of "${item1.name}" and "${item2.name}". The pug should be the main character.`
        : `A funny, cute, photorealistic, cinematic image of the concept: "${itemName}". This concept is a fusion of "${item1.name}" and "${item2.name}".`;

    const fullPrompt = `${basePrompt} The style should be vibrant, whimsical, and playful, like a Pixar movie. The object should be centered on a clean, solid vibrant color background.`;
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating item image:", error);
        return ''; // Return empty string to fallback to emoji
    }
};

export const discoverNewItem = async (item1: Item, item2: Item): Promise<{ name: string, imageUrl: string }> => {
    const name = await generateItemName(item1, item2);
    const imageUrl = await generateItemImage(name, item1, item2);
    return { name, imageUrl };
};
