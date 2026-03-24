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
      `http://localhost:5000/history/${user.id}`
    );

    setData(res.data);
  };

  return (

    <div>

      <Navbar />

      <div style={{ padding: 40 }}>

        <h2>Match History</h2>

        {data.map((m, i) => {

          const win = m.winner === m.team_selected;

          return (

            <div key={i} style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10
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
                  marginLeft: 5
                }}>
                  {win ? "Win" : "Loss"}
                </span>
              </p>

            </div>

          );
        })}

      </div>

    </div>
  );
}