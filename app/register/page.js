"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const teams = ["MI","CSK","RCB","GT","KKR","RR","SRH","LSG","PBKS","DC"];

export default function Register() {

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [defaults, setDefaults] = useState(Array(10).fill(""));

  const router = useRouter();

  // ================= DEFAULT CHANGE =================
  const updateDefault = (index, value) => {

    const newDefaults = [...defaults];
    newDefaults[index] = value;
    setDefaults(newDefaults);
  };

  // ================= VALIDATION =================
  const validateDefaults = () => {

    // all selected
    if (defaults.includes("")) {
      alert("Please select all 10 teams");
      return false;
    }

    // duplicates
    const unique = new Set(defaults);
    if (unique.size !== 10) {
      alert("Each team must be selected only once");
      return false;
    }

    return true;
  };

  // ================= REGISTER =================
  const register = async () => {

    if (!mobile || !name || !password) {
      alert("Fill all details");
      return;
    }

    if (!validateDefaults()) return;

    try {

      // 1️⃣ create user
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { mobile, name, password }
      );

      const user = res.data;

      // 2️⃣ save defaults
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/defaults/set`,
        {
          user_id: user.id,
          teams: defaults
        }
      );

      alert("Registration complete");

      router.push("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (

    <div style={{ padding: 40, maxWidth: 600, margin: "auto" }}>

      <h2>Register</h2>

      <input
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <h3>Select Default Teams (Priority Order)</h3>

      {defaults.map((d, i) => (

        <div key={i} style={{ marginBottom: 10 }}>

          <label>Rank {i + 1}: </label>

          <select
            value={d}
            onChange={(e) => updateDefault(i, e.target.value)}
          >
            <option value="">Select Team</option>

            {teams.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}

          </select>

        </div>

      ))}

      <br />

      <button onClick={register}>
        Register
      </button>

    </div>
  );
}