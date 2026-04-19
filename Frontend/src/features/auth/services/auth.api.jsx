import axios from 'axios';

// 1. Create a custom Axios instance
// This prevents us from re-typing the same Base URL and settings for every request.
const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/auth`, // Base URL for all auth routes
    withCredentials: true // Automatically sends and receives cookies (vital for secure login sessions)
});

// 2. Register a new user
export async function register({ username, password, email }) {
    try {
        // Sends a POST request to 'http://localhost:3000/api/auth/register'
        // Second argument is the "Request Body" (the data the user typed in)
        const response = await api.post('/register', { username, email, password });
        
        return response.data; // Return only the useful data back to the React component
    } catch (err) {
        console.error("Registration error:", err);
        throw err; // "Throw" means send the error back to the component to show a warning UI
    }
}

// 3. Login an existing user
export async function login({ email, password }) {
    try {
        // Sends a POST request to '/login' with the user's email and password
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (err) {
        console.error("Login error:", err);
        throw err;
    }
}

// 4. Logout the user
export async function logout() {
    try {
        // Sends a GET request to out backend to clear the authentication cookie
        const response = await api.get('/logout');
        return response.data;
    } catch (err) {
        console.error("Logout error:", err);
        throw err;
    }
}

// 5. Get the currently logged-in user's data
export async function getMe() {
    try {
        // Sends a GET request. Because 'withCredentials: true' is set above, 
        // the browser automatically sends the user's session cookie to identify them.
        const response = await api.get('/get-me');
        return response.data;
    } catch (err) {
        console.error("Get user info error:", err);
        throw err;
    }
}

