require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GOOGLE_GEMINI_KEY) {
  console.error("❌ GOOGLE_GEMINI_KEY is missing from backend/.env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const modelsToTest = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro"
];

async function testModels() {
  console.log("🔍 Probing available free models for your API key...");
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting model: "${modelName}"...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent("Respond with the single word 'OK'.");
      const text = result.response.text();
      console.log(`✅ SUCCESS: "${modelName}" is fully active! Response: "${text.trim()}"`);
    } catch (err) {
      if (err.status === 404) {
        console.log(`❌ 404 NOT FOUND: "${modelName}" is not available or not supported on this endpoint.`);
      } else if (err.status === 429) {
        console.log(`⚠️ 429 RATE LIMIT/QUOTA EXCEEDED: "${modelName}" exists, but has a 0 request quota or limit.`);
      } else {
        console.log(`❌ ERROR: "${modelName}" failed with:`, err.message);
      }
    }
  }
}

testModels();
