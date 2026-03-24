"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { mobile, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      router.push("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (

    <div style={{ padding: 40 }}>

      <h2>Login</h2>

      <input
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login</button>

      <br /><br />

      <button onClick={() => router.push("/register")}>
        Register
      </button>

    </div>
  );
}