AI Code Reviewer
An AI‑powered code review tool built using the MERN Stack (MongoDB, Express, React (Vite), Node.js), integrated with an AI model (such as Gemini or OpenAI) to review and suggest improvements for user‑submitted code snippets.

⚡️ Features
✅ Paste Code for review.

✅ Get AI Suggestions for improvements.

✅ Store and manage code review history.

✅ User Authentication (Signup/Login).

✅ Responsive and clean React (Vite) frontend.

✅ Backend powered by Node.js + Express.

✅ MongoDB Atlas database for persistent storage.

🛠️ Tech Stack
Front‑end: React (Vite), Tailwind CSS

Back‑end: Node.js, Express.js

Database: MongoDB Atlas

AI Model: Gemini / OpenAI API

Authentication: JWT (JSON Web Tokens)

🚀 Getting Started
⚡️ Prerequisites
Node.js (v18 or higher)

⚡️ Installation
1️⃣ Clone the Repository
git clone https://github.com/surajpsharma/ai-code-reviewer.git
cd ai-code-reviewer

2️⃣ Install Dependencies
Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

3️⃣ Configure Environment Variables
Create a .env file in the backend directory:
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
AI_API_KEY=your-ai-api-key
PORT=5000

4️⃣ Run the Project
Backend:
npm run dev

Frontend:
npm run dev

🌐 Usage
Open http://localhost:5173 in your browser.

Sign Up / Log In.

Paste your code.

Get AI review and suggestions.

Images and screenshots 
Landing page :  ![homepage](https://github.com/user-attachments/assets/ac503f6f-13df-4469-aa45-d9004657398c)

LoginPage: ![login](https://github.com/user-attachments/assets/05502c42-2f27-4abc-8b1e-eecaef416059)

RegisterPage: ![login](https://github.com/user-attachments/assets/b98f7a09-e8f0-46ce-b7e2-b40654bd929c)

ReviewPage  1 :  ![Screenshot 2025-06-20 225036](https://github.com/user-attachments/assets/f2fa8d5e-9ec7-4f13-a300-af6c5125cb96)
2: ![Screenshot 2025-06-20 225453](https://github.com/user-attachments/assets/4bb1a1df-d312-4d26-a01c-ab4ea4a0e541)
History: ![Screenshot 2025-06-20 224939](https://github.com/user-attachments/assets/1c23316f-ef13-4d86-b0b3-6a52b73dea7c)


📁 Project Structure
css
Copy
Edit
├─ backend/
│ └─ src/
├─ frontend/
│ └─ src/
├─ .env
├─ .gitignore
├─ README.md

💡 Future Improvements
Support for multi‑language code review.

Integrate additional AI models.

Admin Dashboard for review statistics.

Enhance syntax highlighting and editor experience.

👋 Contact
For questions or collaboration:

Email: surajsharma030805@gmail.com

