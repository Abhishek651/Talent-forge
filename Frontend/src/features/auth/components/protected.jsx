import { useAuth } from "../Hooks/useAuth";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  // 🔄 While checking auth
  if (loading) {
    return <p>Loading...</p>;
  }

  // 🔐 If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in → show content
  // console.log('User authenticated:', user);
  return children;
};

export default Protected;