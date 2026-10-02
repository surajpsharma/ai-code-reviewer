require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

async function listModels() {
  try {
    // The older SDK might not have listModels exposed directly, or it might be different, but let's try calling the REST API directly just in case.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GEMINI_KEY}`);
    const data = await response.json();
    console.log("Available models:", data.models.map(m => m.name));
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

listModels();
