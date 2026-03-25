"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function History() {

  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/history/${user.id}`
    );

    setData(res.data);
  };

  return (

    <div>

      <Navbar />

      <div style={{ padding: 40, maxWidth: 800, margin: "auto" }}>

        <h2>Match History</h2>

        {data.map((m, i) => {

          const win = m.result === "WIN";

          return (

            <div key={i} style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 15,
              borderRadius: 8
            }}>

              <h4>{m.team1} vs {m.team2}</h4>

              <p>
                Your Pick: {m.team_selected} 
                {m.is_default && " (Default)"}
              </p>

              <p>
                Result: 
                <span style={{
                  color: win ? "green" : "red",
                  marginLeft: 5,
                  fontWeight: "bold"
                }}>
                  {win ? "Win" : "Loss"}
                </span>
              </p>

              <p>
                Amount: 
                <span style={{
                  color: m.net_amount >= 0 ? "green" : "red",
                  marginLeft: 5,
                  fontWeight: "bold"
                }}>
                  ₹ {m.net_amount >= 0 ? "+" : ""}
                  {Number(m.net_amount).toFixed(2)}
                </span>
              </p>

              <p style={{ fontSize: 12, color: "#777" }}>
                {new Date(m.start_time).toLocaleString()}
              </p>

            </div>

          );
        })}

      </div>

    </div>
  );
}