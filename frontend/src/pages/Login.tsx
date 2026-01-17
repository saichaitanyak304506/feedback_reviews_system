import { useState } from "react";
import { login, register } from "../api/api";
import { setToken } from "../auth/auth";
import type{ RegisterRequest } from "../types";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        const payload: RegisterRequest = {
          username,
          email,
          password,
        };
        const res = await register(payload);
        alert(res.message);
        setMode("login");
        return;
      }

      const res = await login(email, password);
      setToken(res.access_token);
      onLogin();
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 m-auto  p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <h2 className="text-xl font-bold text-center">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {mode === "register" && (
          <input
            placeholder="Username"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <p className="text-sm text-center">
          {mode === "login" ? (
            <>
              No account?{" "}
              <span
                className="text-indigo-600 cursor-pointer hover:underline"
                onClick={() => setMode("register")}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
