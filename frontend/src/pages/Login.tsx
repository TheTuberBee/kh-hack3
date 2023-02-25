import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useSelector } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const loggedIn: boolean = useSelector((state: any) => state.loggedIn);

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter all fields");
    } else {
      setError("");
    }

    const loginResponse = await login(email, password);

    if (loginResponse.status < 400) {
      navigate("/");
    } else {
      setError(loginResponse.data);
    }
  };

  return (
    <div className="relative mx-3 flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-transparent border border-white border-4 rounded-md shadow-xl lg:max-w-xl">
        <h1 className="text-3xl font-bold text-center text-white">Sign in</h1>
        <form className="mt-6">
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-white"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-white"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-6">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform  bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:bg-sky-700"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          {error && error.trim().length > 0 && (
            <div className="text-red-500">{error}</div>
          )}
        </form>

        <p className="mt-8 text-xs font-light text-center text-white">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-white font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
