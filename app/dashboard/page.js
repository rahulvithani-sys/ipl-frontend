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

    if (!user || !user.id) return;

    try {

      const balanceRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/balance/${user.id}`
      );
      setBalance(balanceRes.data.balance);

      const poolRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/pool`
      );
      setPool(poolRes.data);

      const matchRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/upcoming`
      );

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
      console.error(err);
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
      alert("Error submitting pick");
    }
  };

  return (
<div className="min-h-screen bg-[#0b0f1a] text-white">

<Navbar />

<div className="max-w-4xl mx-auto px-4 py-6">

{/* HEADER */}
<div className="flex justify-between items-center mb-5">
<h2 className="text-2xl font-bold">🏏 Dashboard</h2>

<div className="bg-gradient-to-r from-yellow-400 to-orange-500
text-black px-4 py-2 rounded-lg font-semibold shadow">
💰 ₹{Number(balance || 0).toFixed(2)}
</div>
</div>

{/* POOLS */}
<div className="flex justify-between mb-6 bg-[#111827]
border border-gray-700 p-4 rounded-xl">
<div>🔥 Phase Pool: ₹{pool.phase_pool || 0}</div>
<div>🏆 Grand Pool: ₹{pool.grand_pool || 0}</div>
</div>

<h3 className="text-lg font-semibold mb-4">Upcoming Matches</h3>

{matches.map(m => {

const locked = isLocked(m.start_time);
const selected = picks[m.id]?.team;
const isDefault = picks[m.id]?.is_default;

const team1 = Number(m.team1_count) || 0;
const team2 = Number(m.team2_count) || 0;

const total = team1 + team2 === 0 ? 1 : team1 + team2;

const t1 = (team1 / total) * 100;
const t2 = (team2 / total) * 100;

return (

<div key={m.id}

className="bg-[#111827] border border-gray-700 rounded-2xl p-5 mb-6 
shadow-lg hover:shadow-2xl transition-all duration-300">

{/* HEADER */}
<div className="flex justify-between text-sm text-gray-400 mb-3">
<span>
{new Date(m.start_time).toLocaleString()}
</span>

<span className={locked ? "text-red-400" : "text-green-400"}>
{locked ? "🔒 Locked" : "🟢 Open"}
</span>
</div>

{/* TEAMS */}
<h3 className="text-lg font-semibold mb-3">
{m.team1} ({m.team1_count || 0}) vs {m.team2} ({m.team2_count || 0})
</h3>

{/* PICK STATUS */}
{selected && (
<span className={`inline-block px-3 py-1 text-xs rounded-full mb-3
${isDefault ? "bg-orange-500" : "bg-green-500"} text-white`}>
{isDefault ? "Default Pick" : "Your Pick"}
</span>
)}

{/* PROGRESS BAR */}
<div className="flex gap-3 mb-4 items-center">

  {/* TEAM 1 BAR */}
  <div className="flex-1">
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-2 bg-gradient-to-r from-orange-400 to-yellow-500 transition-all duration-500"
        style={{ width: `${t1}%` }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-1 text-center">
      {Math.round(t1)}%
    </p>
  </div>

  {/* TEAM 2 BAR */}
  <div className="flex-1">
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
        style={{ width: `${t2}%` }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-1 text-center">
      {Math.round(t2)}%
    </p>
  </div>

</div>

{/* BUTTONS */}
<div className="grid grid-cols-2 gap-3">

<button
disabled={locked}
onClick={() => submitPick(m.id, m.team1)}
className={`py-3 rounded-xl font-semibold transition
${
selected === m.team1
? "bg-gradient-to-r from-orange-400 to-yellow-500 text-black shadow-lg"
: "bg-gray-800 hover:bg-gray-700 text-white"
}`}
>
{m.team1}
</button>

<button
disabled={locked}
onClick={() => submitPick(m.id, m.team2)}
className={`py-3 rounded-xl font-semibold transition
${
selected === m.team2
? "bg-gradient-to-r from-orange-400 to-yellow-500 text-black shadow-lg"
: "bg-gray-800 hover:bg-gray-700 text-white"
}`}
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