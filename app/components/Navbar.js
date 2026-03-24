"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (

    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 30px",
      background: "#111",
      color: "white"
    }}>

      <div style={{ display: "flex", gap: 20 }}>

        <span style={{ cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
          Dashboard
        </span>

        <span style={{ cursor: "pointer" }} onClick={() => router.push("/leaderboard")}>
          Leaderboard
        </span>

        <span style={{ cursor: "pointer" }} onClick={() => router.push("/history")}>
          History
        </span>

        <span onClick={() => router.push("/admin")}>
  Admin
</span>

      </div>

      <button onClick={logout} style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: 5,
        cursor: "pointer"
      }}>
        Logout
      </button>

    </div>
  );
}