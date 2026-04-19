import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

/*
It's handling two files, one auth.api and another is auth.context
Get user input -> specific handle function runs -> calls api to backend -> receive response from backend -> setUser and loading -> UI updates
*/

/*
 Custom Hook: useAuth

This hook connects:
- Global state (AuthContext)
- API calls (login/register/etc)

 It acts as a bridge between UI and backend
*/
export const useAuth = () => {

    /*
    Step 1: Access global auth state
    */
    const context = useContext(AuthContext);

    /*
     Extract values from context
    */
    const { user, loading, setUser, setLoading } = context;

    /*
    LOGIN FUNCTION
    */
    const handleLogin = async ({ email, password }) => {
        setLoading(true); // show loading UI

        try {
            const data = await login({ email, password }); // API call
            setUser(data.user); 
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false); // stop loading
        }

    };

    /*
    📝 REGISTER FUNCTION
    */
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);

        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    /*
     LOGOUT FUNCTION
    */
    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout(); // clear session/cookie from backend
            setUser(null); // remove user from state
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    /*
     CHECK AUTH (Auto login if cookie exists)

     Used when app loads
    */
    const checkAuth = async () => {
        setLoading(true);

        try {
            const data = await getMe(); // backend checks cookie
            setUser(data.user);
        } catch (err) {
            console.log(err)
            setUser(null)
        } finally {
            setLoading(false);
        }
    };


    
    /*
     Return everything to components
    */
    return {
        user, loading, handleLogin, handleRegister, handleLogout, checkAuth
    };
};


// Flow:

// UI calls handleLogin
// API request sent
// Backend returns user
// setUser() updates global state
// Whole app updates automatically