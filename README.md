# 🚀 AI Code Reviewer

![AI Code Reviewer](https://img.shields.io/badge/Gemini%20AI-Powered-8A2BE2?style=for-the-badge&logo=googlebard&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A premium, full-stack MERN application that leverages Google's Gemini AI to provide instant, expert-level code reviews. Paste your code and get a comprehensive analysis covering security, performance, readability, and an AI-refactored version of your code—all within a stunning, glassmorphism UI.

---

## ✨ Features

- **🧠 Google Gemini Integration:** Uses `gemini-3.5-flash-lite` for lightning-fast, highly accurate code reviews.
- **🛡️ Security & Performance Audits:** Automatically detects vulnerabilities (SQLi, XSS, etc.) and performance bottlenecks (O(n²) loops).
- **💬 Interactive AI Chat:** Ask follow-up questions directly to the AI about the generated review.
- **🛠️ Auto-Refactoring:** Gets a complete, production-ready, refactored version of your code.
- **🧪 Test Generation:** Auto-generates unit tests for your code.
- **🎨 Premium UI/UX:** Built with a custom glassmorphism design system, smooth micro-animations, and dynamic visual score gauges.
- **🔒 Secure Authentication:** JWT-based user authentication and secure HTTP-only cookies.
- **📜 Review History:** Saves all past reviews to your dashboard automatically.

---

## 📸 Screenshots

*(Add screenshots of your application here)*
- **Landing Page:** The beautiful animated hero section.
- **Review Dashboard:** The code editor and radial score gauges.
- **Interactive Chat:** Asking follow-up questions to the Gemini AI.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Vanilla CSS** (Custom CSS variables, Glassmorphism, Animations)
- **Lucide-React** (Icons)
- **PrismJS** (Syntax Highlighting)
- **React Markdown** (Markdown Rendering)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database)
- **JSON Web Tokens (JWT)** (Authentication)
- **@google/generative-ai** (Gemini SDK)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB cluster (Atlas or local)
- Google Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repository
```bash
git clone https://github.com/surajpsharma/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
GOOGLE_GEMINI_KEY=your_gemini_api_key_here
MONGODB_STRING=your_mongodb_connection_string
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and run:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/surajpsharma/ai-code-reviewer/issues).

## 📝 License

This project is licensed under the MIT License. Built with ❤️ by Suraj Sharma.

---

## 📫 Contact Me

**Suraj Sharma**
- **GitHub:** [@surajpsharma](https://github.com/surajpsharma)
- **Instagram:** [suraj\_\_sharma\_\_](https://www.instagram.com/__suraj__sharma____)
- **Email:** [surajsharma030805@gmail.com](mailto:surajsharma030805@gmail.com)
