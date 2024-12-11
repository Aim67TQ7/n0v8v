import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear any maintenance mode flags
    localStorage.removeItem('bypass_auth');
    localStorage.removeItem('demo_company_id');
    // Redirect to root which will then handle auth flow
    navigate('/');
  }, [navigate]);

  return null;
};

export default Login;