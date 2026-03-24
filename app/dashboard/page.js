"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {

  const [matches, setMatches] = useState([]);
  const [picks, setPicks] = useState({});
  const [balance, setBalance] = useState(0);
  const [pool, setPool] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      console.error("Invalid user:", user);
      return;
    }

    try {

      // 🔹 Balance
      const balanceRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/balance/${user.id}`
      );
      setBalance(balanceRes.data.balance);

      // 🔹 Pool
      const poolRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/pool`
      );
      setPool(poolRes.data);

      // 🔹 Matches
      const matchRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/upcoming`
      );

      // 🔹 Picks
      const picksRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/picks/${user.id}`
      );

      const pickMap = {};
      (picksRes.data || []).forEach(p => {
        pickMap[p.match_id] = {
          team: p.team_selected,
          is_default: p.is_default
        };
      });

      setMatches(matchRes.data);
      setPicks(pickMap);

    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  const isLocked = (startTime) => {
    return new Date(startTime) <= new Date();
  };

  const submitPick = async (matchId, team) => {

    const user = JSON.parse(localStorage.getItem("user"));

    try {

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/picks/submit`,
        {
          user_id: user.id,
          match_id: matchId,
          team
        }
      );

      loadData();

    } catch (err) {
      console.error(err);
      alert("Error submitting pick");
    }
  };

  return (
    <div>

      <Navbar />

      <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>

        {/* 🔹 HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20
        }}>
          <h2>🏏 Dashboard</h2>
          <h3>💰 ₹{balance}</h3>
        </div>

        {/* 🔹 POOLS */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
          background: "#f5f5f5",
          padding: 15,
          borderRadius: 10
        }}>
          <div>🔥 Phase Pool: ₹{pool.phase_pool || 0}</div>
          <div>🏆 Grand Pool: ₹{pool.grand_pool || 0}</div>
        </div>

        <h3>Next Matches</h3>

        {/* 🔹 MATCH CARDS */}
        {matches.map(m => {

          const locked = isLocked(m.start_time);
          const selected = picks[m.id]?.team;
          const isDefault = picks[m.id]?.is_default;

          return (

            <div key={m.id} style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>

              <h3>{m.team1} vs {m.team2}</h3>

              <p style={{ fontSize: 14, color: "#555" }}>
                Starts: {new Date(m.start_time).toLocaleString()}
              </p>

              {/* 🔹 PICK STATUS */}
              {selected && (
                <span style={{
                  padding: "5px 10px",
                  background: isDefault ? "orange" : "green",
                  color: "white",
                  borderRadius: 8,
                  fontSize: 12
                }}>
                  {isDefault ? "Default Pick" : "Your Pick"}
                </span>
              )}

              {/* 🔹 LOCKED */}
              {locked && (
                <p style={{ color: "red", marginTop: 10 }}>
                  ⛔ Match Closed
                </p>
              )}

              {/* 🔹 BUTTONS */}
              <div style={{
                display: "flex",
                gap: 15,
                marginTop: 15
              }}>

                <button
                  disabled={locked}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: "none",
                    cursor: locked ? "not-allowed" : "pointer",
                    background:
                      selected === m.team1 ? "#28a745" : "#ddd",
                    color:
                      selected === m.team1 ? "white" : "black"
                  }}
                  onClick={() => submitPick(m.id, m.team1)}
                >
                  {m.team1}
                </button>

                <button
                  disabled={locked}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: "none",
                    cursor: locked ? "not-allowed" : "pointer",
                    background:
                      selected === m.team2 ? "#28a745" : "#ddd",
                    color:
                      selected === m.team2 ? "white" : "black"
                  }}
                  onClick={() => submitPick(m.id, m.team2)}
                >
                  {m.team2}
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}