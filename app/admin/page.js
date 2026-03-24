"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const teams = ["MI","CSK","RCB","GT","KKR","RR","SRH","LSG","PBKS","DC"];

export default function Admin() {

  const [form, setForm] = useState({
    match_number: "",
    team1: "",
    team2: "",
    start_time: "",
    phase: 1
  });

  const [pendingMatches, setPendingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [winnerMap, setWinnerMap] = useState({});

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.mobile !== "9820383884") {
      alert("Not authorized");
      window.location.href = "/dashboard";
      return;
    }

    loadMatches();

  }, []);

  const loadMatches = async () => {
    const pendingRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/matches/pending`);
    const completedRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/matches/completed`);

    setPendingMatches(pendingRes.data);
    setCompletedMatches(completedRes.data);
  };

  const addMatch = async () => {
    if (!form.team1 || !form.team2 || form.team1 === form.team2) {
      alert("Invalid teams");
      return;
    }

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/matches/add`, form);
    alert("Match added");
    loadMatches();
  };

  const submitResult = async (matchId) => {
    const winner = winnerMap[matchId];

    if (!winner) {
      alert("Select winner");
      return;
    }

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/results/process`, {
      match_id: matchId,
      winner
    });

    alert("Result processed");
    loadMatches();
  };

  const rollback = async (matchId) => {
    if (!confirm("Rollback this match?")) return;

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/results/rollback`, {
      match_id: matchId
    });

    alert("Rollback done");
    loadMatches();
  };

  const abandon = async (matchId) => {
    if (!confirm("Mark match abandoned?")) return;

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/results/abandon`, {
      match_id: matchId
    });

    alert("Match abandoned");
    loadMatches();
  };

  const badge = (status) => ({
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    color: "white",
    background:
      status === "completed" ? "#28a745" :
      status === "pending" ? "#ffc107" :
      "#6c757d"
  });

  const card = {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    background: "white"
  };

  const button = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  };

  return (

    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>

      <Navbar />

      <div style={{ maxWidth: 900, margin: "auto", padding: 30 }}>

        <h2 style={{ marginBottom: 20 }}>⚙️ Admin Panel</h2>

        {/* ADD MATCH */}
        <div style={card}>

          <h3>Add Match</h3>

          <div style={{ display: "grid", gap: 10 }}>

            <input placeholder="Match Number"
              onChange={(e) => setForm({ ...form, match_number: e.target.value })}
            />

            <select onChange={(e) => setForm({ ...form, team1: e.target.value })}>
              <option>Team 1</option>
              {teams.map(t => <option key={t}>{t}</option>)}
            </select>

            <select onChange={(e) => setForm({ ...form, team2: e.target.value })}>
              <option>Team 2</option>
              {teams.map(t => <option key={t}>{t}</option>)}
            </select>

            <input type="datetime-local"
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />

            <input type="number" placeholder="Phase"
              onChange={(e) => setForm({ ...form, phase: e.target.value })}
            />

            <button
              style={{ ...button, background: "#007bff", color: "white" }}
              onClick={addMatch}
            >
              Add Match
            </button>

          </div>

        </div>

        {/* PENDING */}
        <h3>🟡 Pending Matches</h3>

        {pendingMatches.map(m => (

          <div key={m.id} style={card}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>{m.team1} vs {m.team2}</h4>
              <span style={badge(m.status)}>{m.status}</span>
            </div>

            <div style={{ marginTop: 10 }}>

              <select
                style={{ padding: 8 }}
                onChange={(e) =>
                  setWinnerMap({
                    ...winnerMap,
                    [m.id]: e.target.value
                  })
                }
              >
                <option>Select Winner</option>
                <option value={m.team1}>{m.team1}</option>
                <option value={m.team2}>{m.team2}</option>
              </select>

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>

                <button
                  style={{ ...button, background: "#28a745", color: "white" }}
                  onClick={() => submitResult(m.id)}
                >
                  Process
                </button>

                <button
                  style={{ ...button, background: "#6c757d", color: "white" }}
                  onClick={() => abandon(m.id)}
                >
                  Abandon
                </button>

              </div>

            </div>

          </div>

        ))}

        {/* COMPLETED */}
        <h3>🔵 Completed Matches</h3>

        {completedMatches.map(m => (

          <div key={m.id} style={card}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>{m.team1} vs {m.team2}</h4>
              <span style={badge(m.status)}>{m.status}</span>
            </div>

            <p style={{ marginTop: 10 }}>Winner: {m.winner}</p>

            <button
              style={{ ...button, background: "#fd7e14", color: "white" }}
              onClick={() => rollback(m.id)}
            >
              Rollback
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}