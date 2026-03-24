"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Leaderboard() {

  const [data, setData] = useState([]);
  const [phaseData, setPhaseData] = useState([]);
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    load();
  }, [phase]);

  const load = async () => {

    const overall = await axios.get(
      "http://localhost:5000/leaderboard"
    );

    const phaseRes = await axios.get(
      `http://localhost:5000/leaderboard/phase/${phase}`
    );

    setData(overall.data);
    setPhaseData(phaseRes.data);
  };

  return (

    <div>

      <Navbar />

      <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>

        {/* ================= OVERALL ================= */}
        <h2>🏆 Overall Leaderboard</h2>

        <table style={table}>
          <thead>
            <tr style={header}>
              <th style={th}>Rank</th>
              <th style={th}>Name</th>
              <th style={th}>Balance (₹)</th>
              <th style={th}>Points</th>
              <th style={th}>Wins</th>
            </tr>
          </thead>

          <tbody>
            {data.map((u, i) => (
              <tr key={u.id} style={{
                ...row,
                background:
                  i === 0 ? "#ffd700" :
                  i === 1 ? "#c0c0c0" :
                  i === 2 ? "#cd7f32" : ""
              }}>
                <td style={td}>#{i + 1}</td>
                <td style={td}>{u.name}</td>
                <td style={td}>{Number(u.balance).toFixed(2)}</td>
                <td style={td}>{Number(u.total_points || 0).toFixed(2)}</td>
                <td style={td}>{u.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= PHASE ================= */}
        <div style={{ marginTop: 50 }}>

          <h2>🔥 Phase Leaderboard</h2>

          <div style={{ marginBottom: 20 }}>
            <label>Select Phase: </label>

            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              style={{ padding: 8, marginLeft: 10 }}
            >
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
              <option value="4">Phase 4</option>
              <option value="5">Phase 5</option>
            </select>
          </div>

          <table style={table}>
            <thead>
              <tr style={header}>
                <th style={th}>Rank</th>
                <th style={th}>Name</th>
                <th style={th}>Points</th>
              </tr>
            </thead>

            <tbody>
              {phaseData.map((u, i) => (
                <tr key={u.id} style={{
                  ...row,
                  background:
                    i === 0 ? "#ffd700" :
                    i === 1 ? "#c0c0c0" :
                    i === 2 ? "#cd7f32" : ""
                }}>
                  <td style={td}>#{i + 1}</td>
                  <td style={td}>{u.name}</td>
                  <td style={td}>{Number(u.total_points || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}


// ================= STYLES =================

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 20
};

const header = {
  background: "#f5f5f5"
};

const th = {
  padding: 10,
  borderBottom: "2px solid #ccc"
};

const td = {
  padding: 10,
  textAlign: "center"
};

const row = {
  borderBottom: "1px solid #ddd"
};