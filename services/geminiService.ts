
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const mockAnalysisResult: AnalysisResult = {
    file: { name: "mock_song.mp3", size: 5 * 1024 * 1024 },
    top3: [
        { genre: "Indie Rock", probability: 0.65 },
        { genre: "Alternative", probability: 0.25 },
        { genre: "Shoegaze", probability: 0.10 },
    ]
};

// FIX: Helper function to convert a File object to a base64 string for the API.
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};


export const analyzeAudioFile = async (file: File): Promise<AnalysisResult> => {
    if (!ai) {
        console.log("Using mock Gemini response.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            ...mockAnalysisResult,
            file: { name: file.name, size: file.size }
        };
    }
    
    // FIX: The application should analyze the audio content, not just the filename.
    // Convert the audio file to a base64 string and create the parts for the multimodal request.
    const audioData = await fileToBase64(file);
    const audioPart = {
        inlineData: {
            mimeType: file.type,
            data: audioData,
        },
    };
    
    const prompt = `You are an expert music genre classifier AI named GenreSense.
    Based on the provided audio, predict the top 3 most likely music genres.
    
    Return your response as a valid JSON object. Do not include any text outside of the JSON object.
    The probabilities in the "top3" array must sum to 1.0.`;

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // FIX: Send both the audio data and the prompt to the model.
            contents: { parts: [audioPart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        top3: {
                            type: Type.ARRAY,
                            description: "An array of the top 3 predicted genres and their probabilities.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    genre: {
                                        type: Type.STRING,
                                        description: "The name of the music genre."
                                    },
                                    probability: {
                                        type: Type.NUMBER,
                                        description: "The probability score for this genre, between 0 and 1."
                                    }
                                },
                                required: ["genre", "probability"]
                            }
                        }
                    },
                    required: ["top3"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString);

        if (!parsedResult.top3 || parsedResult.top3.length !== 3) {
            throw new Error("Invalid response format from Gemini API.");
        }
        
        const finalResult: AnalysisResult = {
            file: {
                name: file.name,
                size: file.size,
            },
            top3: parsedResult.top3,
        };

        return finalResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from AI model.");
    }
};
