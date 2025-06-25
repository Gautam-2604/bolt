"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const genai_1 = require("@google/genai");
dotenv_1.default.config();
console.log(process.env.GEMENI_API_KEY);
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMENI_API_KEY });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                { role: "user", parts: [{ text: "Make a simple To-do website" }] }
            ],
            config: {
                systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
                temperature: 0.1
            },
        });
        console.log(result.text);
    });
}
main();
