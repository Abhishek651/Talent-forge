<div align="center">
  <h1> 
    📜 TalentForge
  </h1>
  <p><strong>AI-Powered Intelligent Interview Simulation Platform</strong></p>
  <h3><a href="https://talent-forge.onrender.com">🌍 View Live Demo</a></h3>
</div>

<br />

TalentForge is an intelligent, full-stack application engineered to revolutionize the interview preparation process. By leveraging large language models and context-aware resume parsing, it dynamically generates tailored interview questions, evaluates user responses, and delivers actionable competency reports. 

Architected with an emphasis on performance, security, and user experience, this platform demonstrates robust full-stack capabilities, handling complex state flow, secure authentication, and seamless third-party AI integrations.

---

## 🚀 Impact & Value
- **Context-Aware Questioning:** Parses user resumes (`pdf-parse`) to instruct the AI to generate personalized, hyper-relevant technical questions rather than generic templates.
- **Automated Competency Scoring:** Analyzes candidate responses via OpenRouter SDK to formulate structured, qualitative feedback and scoring mechanisms.
- **Secure by Design:** Implements robust JWT-based authentication with `httpOnly` cookies and token blacklisting for uncompromising security standards.

## 🛠 Features

- **Sophisticated Resume Parsing Pipeline:** Engineered a Multer-backed file upload system that streams and extracts text data from PDFs, feeding localized context into the AI engine.
- **Dynamic AI Integration:** Integrated OpenRouter SDK to stream customized interview prompts, managing rate limits and graceful fallback error handling for high availability.
- **Robust Authentication Architecture:** Developed a comprehensive authentication flow featuring password hashing (`bcryptjs`), secure cookie sessions, and stateless JWT validation, bound together by strict Zod schema validation.
- **Stateful Interactive UI:** Orchestrated a responsive, component-driven frontend using React, paired with Shadcn UI and Tailwind CSS. Managed complex application state across nested conversational interfaces.
- **Performance-Optimized Data Layer:** Designed a normalized MongoDB schema using Mongoose to persist historical interview reports, user profiles, and active session states efficiently.
- **Fluid User Experience:** Implemented dynamic routing, protected component wrappers, and non-blocking Lottie animations (`@lottiefiles`) to ensure a polished, professional-grade interface.

## 💻 Technical Stack

### Frontend Architecture
- **Core:** React 19, Vite, React Router v7
- **Styling & UI:** Tailwind CSS v4, Shadcn UI, Class Variance Authority (CVA), Radix UI
- **State & Data Fetching:** Context API, Custom Hooks (`useAuth`, `useInterview`), Axios
- **Assets:** Lucide React (Iconography), @fontsource/poppins, DotLottie React

### Backend Infrastructure
- **Engine:** Node.js, Express.js (v5)
- **Database:** MongoDB, Mongoose ODM
- **Security & Validation:** JWT (JSON Web Tokens), bcryptjs, Zod
- **Core Integrations:** OpenRouter SDK (AI inference), Multer (multipart/form-data), PDF-Parse (document processing)

## 🧠 Technical Learnings & Problem Solving

During the development of TalentForge, several core engineering challenges were resolved:

1. **Intelligent State Synchronization:** Managed complex asynchronous state between the AI generation layer and the frontend. Engineered robust React Context providers to prevent race conditions during question progression and report generation.
2. **Secure Session Maintenance:** Migrated from `localStorage` tokens to `httpOnly` secure cookies. Implemented token blacklisting on logout to prevent replay attacks and secure user sessions against XSS vulnerabilities.
3. **Graceful Degradation with External APIs:** The AI inference layer occasionally suffers from timeouts or high latency (`Service Unavailable`). Implemented resilient error handling and UI fallback boundaries to maintain application stability without degrading the user experience.
4. **Data Validation Integrity:** Enforced strict data contracts between the client and server using `Zod`, drastically reducing runtime errors and ensuring malformed data never hits the database or AI prompt execution.

## ⚙️ Local Environment Setup

### Prerequisites
- Node.js (v18+)
- MongoDB connection string 
- OpenRouter API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Establish environment variables. Create a `.env` file:
   ```env
   MONGO_URL=your_mongodb_connection_string
   SECRET=your_jwt_security_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Initialize the server:
   ```bash
   npm run dev
   ```
   *The server runs locally on port 3000.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Establish environment variables. Create a `.env` file:
   ```env
   VITE_BACKEND_URL=your_backend_url (e.g., http://localhost:3000)
   ```
4. Initialize the client:
   ```bash
   npm run dev
   ```
   *The Vite development server runs on port 5173.*



