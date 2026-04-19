# Production Deployment Issues & Solutions

This document outlines common issues encountered when deploying TalentForge to production (e.g., Render) and provides clear explanations and solutions for each.

---

## 1. CORS Issue

**Symptom:**
- Backend rejects requests from the frontend with CORS errors.

**Why it happens:**
- The backend is not configured to accept requests from the deployed frontend domain.

**How to fix:**
- In your backend CORS configuration, set the `origin` to your deployed frontend URL (e.g., `https://talent-forge.onrender.com`) or use an environment variable for flexibility.
- Example (Express):
  ```js
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  }));
  ```
- Set the `FRONTEND_URL` environment variable in your Render backend service settings.

---

## 2. React Router 404 on Direct Navigation

**Symptom:**
- Visiting a route like `/login` or `/dashboard` directly in the browser returns a 404 Not Found error in production.

**Why it happens:**
- In development, Vite intercepts all routes and serves `index.html` for React Router to handle.
- In production, static hosts like Render look for a physical file/folder matching the route, which doesn't exist for SPA routes.

**How to fix:**
- Add a rewrite rule in Render to serve `index.html` for all unmatched routes:
  1. Go to your Render Dashboard.
  2. Select your Frontend (Static Site) service.
  3. Click on **Redirects/Rewrites**.
  4. Add:
     - **Source:** `/*`
     - **Destination:** `/index.html`
     - **Action:** `Rewrite`
  5. Save changes.

---

## 3. 401 Unauthorized Errors (Axios Requests)

**Symptom:**
- API requests that require authentication fail with 401 Unauthorized in production, even after logging in.

**Why it happens:**
- Browsers block cross-site cookies by default for security. Your backend and frontend are on different domains in production, so cookies are not sent.

**How to fix:**
- When setting cookies in your backend, use these options:
  ```js
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  });
  ```
- When clearing cookies (logout), use the same options.
- Ensure your frontend Axios requests use `withCredentials: true`.
- Set CORS `credentials: true` and `origin` to your frontend URL.

---

## 4. React State Timing Issue: No Redirect After Report Generation

**Symptom:**
- After generating a report, the page does not redirect to the dashboard in production.

**Why it happens:**
- State updates in React (like `setReport`) are asynchronous. Immediately checking `if (report)` after `await generateReport(...)` may not work, especially with real network latency in production.

**How to fix:**
- Use a `useEffect` to watch for the `report` state and redirect when it updates:
  ```js
  useEffect(() => {
    if (report && !loading) {
      navigate("/dashboard");
    }
  }, [report, loading, navigate]);
  ```
- Remove the old `if (report) navigate("/dashboard")` from your submit handler.

---

**Keep this document updated as you encounter and solve new production issues!**