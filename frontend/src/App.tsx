import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { getToken,clearToken } from "./auth/auth";
import "./App.css"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

   const logout = () => {
     clearToken();  
     setLoggedIn(false);  
   }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <Dashboard onLogout={logout} />;
}
