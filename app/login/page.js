"use client";

import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { mobile, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">

      <div className="bg-[#111827] p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          🏏 IPL Predictor Login
        </h1>

        <input
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-[#1f2937] border border-gray-700 focus:outline-none focus:border-yellow-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-[#1f2937] border border-gray-700 focus:outline-none focus:border-yellow-400"
        />

        <button
          onClick={login}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-lg font-bold"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-400">
          New user?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            className="text-yellow-400 cursor-pointer"
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}