const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

async function chatReview(code, reviewContext, messages) {
  if (!process.env.GOOGLE_GEMINI_KEY) {
    throw new Error("GOOGLE_GEMINI_KEY is missing from environment variables.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    systemInstruction: `
You are a helpful Senior AI Pair Programmer. The user is asking follow-up questions about a code review you recently performed.
Keep your answers professional, direct, and educational.

If the user asks for code changes, explain the changes clearly and output the fully updated code block in your response.
`,
  });

  // Format messages for the prompt
  let conversationHistory = "";
  if (Array.isArray(messages) && messages.length > 0) {
    conversationHistory = messages.map(msg => {
      const sender = msg.role === "user" ? "Developer" : "AI Reviewer";
      return `${sender}: ${msg.text}`;
    }).join("\n");
  }

  const prompt = `
Context:
---
Original Code Submitted:
\`\`\`
${code}
\`\`\`

Initial Review Details:
${typeof reviewContext === "object" ? JSON.stringify(reviewContext, null, 2) : reviewContext}
---

Conversation History:
${conversationHistory || "No history yet."}

Latest message from Developer:
"${messages[messages.length - 1]?.text || "Please clarify the review."}"

Please respond to the developer.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}

module.exports = chatReview;
