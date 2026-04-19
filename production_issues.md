# Production Issues

## 1. CORS Issue
Backend rejected the frontend requests.

---

## 2. React Router Issue: GET /login 404 (Not Found)

**Why it happens:** 
You built a Single Page Application (SPA) using React Router. In development (npm run dev), Vite secretly catches every URL request (like /login or /dashboard) and sends the index.html file back, allowing React Router to take over and show the right component.
However, Render's "Static Site" infrastructure is literal. When you visit your live site at /login, Render's static server looks for a folder named login with an index.html inside it (which doesn't exist, as Vite only outputs one dist/index.html).

**How to fix it:** 
You need to tell Render to route ALL traffic to your index.html file so React Router can process the URL.

1. Go to your Render Dashboard.
2. Select your Frontend (Static Site) service.
3. On the left sidebar, click on **Redirects/Rewrites**.
4. Add a new rule with the following exact values:
   - **Source:** /*
   - **Destination:** /index.html
   - **Action:** Rewrite 
   *(Make sure it's set to "Rewrite", not "Redirect"!)*
5. Click **Save Changes**. (This takes effect almost immediately).

---

## 3. The 401 Unauthorized Error (Axios Request Failed)

**Why it happens:**
In development, your frontend and backend both run on localhost (just different ports), so the browser automatically shares your authentication cookies.

However, in production, Render puts them on completely different domains (e.g., talent-forge.onrender.com vs talent-forge-backend.onrender.com). Modern browsers block cross-domain cookies by default for security to prevent Cross-Site Request Forgery (CSRF).

When you log in successfully on Render, your backend sends the cookie, but the browser throws it away. Then, when your frontend tries to fetch the /get-me or /report routes, it has no cookie to send. Your backend's auth.middleware.js sees if(!token), and correctly throws a 401 Unauthorized.

**How to fix it:**
You need to explicitly tell the browser to allow this cross-origin cookie by updating how you send it in your Backend controllers.
In auth.controllers.js, find where you do `res.cookie('token', token)` (in both registerUserController and loginUserController) and update them to look like this:

*Note: You also need to do the exact same thing in logoutUserController when clearing the cookie.*


The reason your page is not redirecting after report generation in production is because of how the redirect logic is implemented in your home.jsx:

await generateReport({ ... });
if (report) {
  // Only navigate if no error
  navigate("/dashboard");
}


Why this works locally but fails in production:
generateReport is asynchronous and updates the report state using setReport(generatedReport).
In React, state updates (setReport) are asynchronous and do not update immediately. So, right after await generateReport(...), the value of report is still the old value (likely null).
Locally, this sometimes works due to timing, but in production (with real network latency), the state update is even less likely to be immediate, so if (report) is false and the redirect never happens.
How to fix:
You should redirect after the report state is actually updated. The best way is to use a useEffect that watches for report changes:
useEffect(() => {
  if (report && !loading) {
    navigate("/dashboard");
  }
}, [report, loading, navigate]);

Remove the if (report) navigate("/dashboard") from your handleSubmit.
Add the above useEffect to your Home component.
This guarantees the redirect will always happen after the report is set, both locally and in production