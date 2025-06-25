import dotenv from 'dotenv'
import { GoogleGenAI } from "@google/genai";


dotenv.config()

console.log(process.env.GEMENI_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMENI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
    "Make a simple To-do website in React ans TS"

  ],
  config: {
    tools: [{ codeExecution: {} }],
     systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    temperature: 0.1
  },
  });
  const parts = response?.candidates?.[0]?.content?.parts || [];
parts.forEach((part) => {
  if (part.text) {
    console.log(part.text);
  }

  if (part.executableCode && part.executableCode.code) {
    console.log(part.executableCode.code);
  }

  if (part.codeExecutionResult && part.codeExecutionResult.output) {
    console.log(part.codeExecutionResult.output);
  }
})
}

main();


