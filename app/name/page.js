"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NamePage() {

  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/login");
      return;
    }

    // If already has name → skip
    if (user.name) {
      router.push("/dashboard");
    }

  }, []);

  const saveName = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.post(
      "http://localhost:5000/auth/update-name",
      {
        user_id: user.id,
        name
      }
    );

    // update localStorage
    localStorage.setItem("user", JSON.stringify(res.data));

    router.push("/dashboard");

  };

  return (

    <div style={{ padding: "50px", textAlign: "center" }}>

      <h2>Enter Your Name</h2>

      <input
        placeholder="Your Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={saveName}>
        Continue
      </button>

    </div>

  );
}