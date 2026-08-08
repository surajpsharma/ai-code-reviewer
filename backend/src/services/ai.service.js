const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

async function generateContent(code, language = "auto", focus = "general") {
  if (!process.env.GOOGLE_GEMINI_KEY) {
    throw new Error("GOOGLE_GEMINI_KEY is missing from environment variables.");
  }

  // Create the model instance dynamically to set the focus mode in systemInstruction
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: `
You are a Senior AI Code Reviewer (10+ Years of Experience) and an expert software engineer.
Your job is to analyze, review, and suggest optimizations for the provided code.

You MUST respond ONLY with a JSON object. Do not wrap the response in markdown blocks. Output raw JSON.

The JSON object must have the following structure:
{
  "language": "detected or specified programming language (e.g. JavaScript, Python, C++, Go, etc.)",
  "scores": {
    "quality": 85, // 0-100 score based on overall code quality
    "security": 90, // 0-100 score based on vulnerability detection
    "performance": 80, // 0-100 score based on performance & memory usage
    "readability": 95 // 0-100 score based on naming, simplicity, comments
  },
  "summary": "A concise 2-3 sentence overview of the code quality and overall feedback.",
  "issues": [
    {
      "line": 5, // The 1-indexed line number where the issue occurs, or 0 if it applies to the whole file
      "severity": "critical", // "critical", "warning", or "suggestion"
      "title": "Short issue title",
      "description": "Detailed explanation of why this line/block is problematic.",
      "fix": "Actionable instructions or code snippet to fix it."
    }
  ],
  "fixedCode": "The complete, fully refactored, and optimized version of the input code, incorporating all suggested fixes.",
  "improvements": [
    "Key improvement explanation 1",
    "Key improvement explanation 2"
  ],
  "testCases": "A complete, executable test suite for the fixed version of the code (e.g. Jest for JS/TS, pytest for Python, unittest/JUnit for Java, etc.) with mock assertions."
}

Focus Mode Guidelines:
- Current focus mode is "${focus}".
  - "general": Provide a balanced review of all areas.
  - "security": Focus heavily on identifying security threats (XSS, SQL Injection, CSRF, insecure libraries, buffer overflows, data leaks). Lower the "security" score if issues are found.
  - "performance": Focus heavily on CPU/Memory bottlenecks, slow loops, nested iterations, memory leaks, and redundant DB queries. Lower the "performance" score if issues are found.
  - "clean": Focus heavily on SOLID, DRY, KISS principles, coding standards, naming conventions, and modularity. Lower "readability" and "quality" scores if code is messy or hard to read.
  - "tests": Focus heavily on test coverage. Ensure the "testCases" field contains a comprehensive, multi-scenario test suite.
`,
  });

  const prompt = `
Please review the following code.
Programming Language Input: ${language}
Review Focus Mode: ${focus}

Code:
\`\`\`
${code}
\`\`\`
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}

module.exports = generateContent;
