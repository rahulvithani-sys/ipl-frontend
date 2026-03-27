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
`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`
);

const phaseRes = await axios.get(
`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/phase/${phase}`
);

setData(overall.data);
setPhaseData(phaseRes.data);
};

return (
<div className="min-h-screen bg-[#0b0f1a] text-white">

<Navbar />

<div className="max-w-5xl mx-auto p-6">

{/* ================= OVERALL ================= */}
<h2 className="text-2xl font-bold mb-6 text-yellow-400">
🏆 Overall Leaderboard
</h2>

<div className="bg-[#111827] rounded-xl overflow-hidden shadow-lg">
<table className="w-full text-center">

<thead className="bg-gray-800 text-gray-300">
<tr>
<th className="p-3">Rank</th>
<th className="p-3">Name</th>
<th className="p-3">Balance (₹)</th>
<th className="p-3">Points</th>
<th className="p-3">Wins</th>
</tr>
</thead>

<tbody>
{data.map((u, i) => (
<tr
key={u.id}
className={`border-b border-gray-700 ${
i === 0
? "bg-yellow-400 text-black font-bold"
: i === 1
? "bg-gray-300 text-black font-semibold"
: i === 2
? "bg-orange-400 text-black font-semibold"
: "hover:bg-gray-800"
}`}
>
<td className="p-3">#{i + 1}</td>
<td className="p-3">{u.name}</td>
<td className="p-3">
{Number(u.balance).toFixed(2)}
</td>
<td className="p-3">
{Number(u.total_points || 0).toFixed(2)}
</td>
<td className="p-3">{u.wins}</td>
</tr>
))}
</tbody>

</table>
</div>

{/* ================= PHASE ================= */}
<div className="mt-12">

<h2 className="text-2xl font-bold mb-4 text-orange-400">
🔥 Phase Leaderboard
</h2>

<div className="mb-4">
<label className="mr-2">Select Phase:</label>

<select
value={phase}
onChange={(e) => setPhase(e.target.value)}
className="bg-gray-800 border border-gray-600 rounded px-3 py-1"
>
<option value="1">Phase 1</option>
<option value="2">Phase 2</option>
<option value="3">Phase 3</option>
<option value="4">Phase 4</option>
<option value="5">Phase 5</option>
</select>
</div>

<div className="bg-[#111827] rounded-xl overflow-hidden shadow-lg">
<table className="w-full text-center">

<thead className="bg-gray-800 text-gray-300">
<tr>
<th className="p-3">Rank</th>
<th className="p-3">Name</th>
<th className="p-3">Points</th>
</tr>
</thead>

<tbody>
{phaseData.map((u, i) => (
<tr
key={u.id}
className={`border-b border-gray-700 ${
i === 0
? "bg-yellow-400 text-black font-bold"
: i === 1
? "bg-gray-300 text-black font-semibold"
: i === 2
? "bg-orange-400 text-black font-semibold"
: "hover:bg-gray-800"
}`}
>
<td className="p-3">#{i + 1}</td>
<td className="p-3">{u.name}</td>
<td className="p-3">
{Number(u.total_points || 0).toFixed(2)}
</td>
</tr>
))}
</tbody>

</table>
</div>

</div>

</div>

</div>
);
}