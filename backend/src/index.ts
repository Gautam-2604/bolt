import dotenv from 'dotenv';
import express from "express";
import { GoogleGenAI } from "@google/genai";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import cors from "cors";

dotenv.config()

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMENI_API_KEY
});

console.log(process.env.GEMENI_API_KEY, "Key");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/template", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ],
            config: {
                systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
                temperature: 0.1,
                maxOutputTokens: 10
            }
        });

        const answer = result.text?.trim();

        if (answer === "react") {
            res.json({
                prompts: [
                    BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n - .gitignore\n - package-lock.json\n`
                ],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n - .gitignore\n - package-lock.json\n`
                ],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(403).json({ message: "You cant access this" });
    } catch (error) {
        console.error("Error in /template:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;
        
        // Convert messages to Gemini format
        const contents = messages.map((msg: { role: string; content: any; }) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: contents,
            config: {
                systemInstruction: getSystemPrompt(),
                temperature: 0.7,
                maxOutputTokens: 8000
            }
        });
        
        console.log(result);
        res.json({
            response: result.text
        });
    } catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});