import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";
/*
 Step 1: Create a Context
This is like a global storage box where we will store auth data (user info)
*/
export const AuthContext = createContext();

/*
 Step 2: Create a Provider Component
This component will wrap our app and provide data to all children
*/
export const AuthProvider = ({ children }) => {

  /*
   Step 3: Create State
  */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    //getting logged in user on refresh
    // getMe func => auth.api => backend getMe func run => token verify from cookies => 
    // check user in db => return user => setUser runs => loading false => UI renders
    // Run auth check once at app start (Provider).
    // Putting it in hook would trigger multiple API calls per component usage.
  useEffect(()=>{
    const getAndSetUser = async () => {
        try {
            const data = await getMe();
            setUser(data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    getAndSetUser();
  },[])
 

  /*
   Step 4: Provide values to entire app

  value={{...}} → data we want to share globally

  children → VERY IMPORTANT
  It renders all components wrapped inside AuthProvider

  Without children:
  App will not render
  Context will not work
  */
  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};