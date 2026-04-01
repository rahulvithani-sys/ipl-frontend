"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";


const TEAMS = [
"MI","CSK","RCB","KKR","SRH",
"RR","PBKS","DC","GT","LSG"
];

export default function DefaultsPage() {

const [currentDefaults, setCurrentDefaults] = useState([]);
const [newDefaults, setNewDefaults] = useState(Array(10).fill(""));
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const API = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Fetch current defaults
useEffect(() => {
const fetchDefaults = async () => {
const user = JSON.parse(localStorage.getItem("user"));
const res = await axios.get(`${API}/defaults/${user.id}`);
setCurrentDefaults(res.data);
};
fetchDefaults();
}, []);

// 🔹 Handle dropdown change
const handleChange = (index, value) => {
const updated = [...newDefaults];
updated[index] = value;
setNewDefaults(updated);
};

// 🔹 Validate before submit
const validate = () => {

// 1. All selected
if (newDefaults.includes("")) {
return "Please select all 10 teams";
}

// 2. No duplicates
const unique = new Set(newDefaults);
if (unique.size !== 10) {
return "Teams cannot repeat";
}

// 3. Time restriction (IST)
const now = new Date();
const ist = new Date(
now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);

const hours = ist.getHours();
const minutes = ist.getMinutes();

const currentMinutes = hours * 60 + minutes;
const start = 1 * 60; // 1:00 AM
const end = 15 * 60 + 30; // 3:30 PM

if (currentMinutes < start || currentMinutes > end) {
return "Defaults can only be updated between 1 AM and 3:30 PM IST";
}

return null;
};

// 🔹 Submit
const handleSubmit = async () => {
setError("");
setSuccess("");

const validationError = validate();
if (validationError) {
setError(validationError);
return;
}

try {
const user = JSON.parse(localStorage.getItem("user"));

await axios.post(`${API}/defaults/set`, {
user_id: user.id,
teams: newDefaults
});

setSuccess("Defaults updated successfully ✅");
setCurrentDefaults(newDefaults);

} catch (err) {
setError("Failed to update defaults");
}
};

return (
<div className="p-6 text-white">


<Navbar />

{/* CURRENT DEFAULTS */}
<h2 className="text-xl mb-3">Current Defaults</h2>
<div className="mb-6 grid grid-cols-5 gap-2">
{currentDefaults.map((team, i) => (
<div key={i} className="bg-gray-700 p-2 rounded text-center">
{team}
</div>
))}
</div>

{/* NEW DEFAULTS */}
<h2 className="text-xl mb-3">Update Defaults</h2>

<div className="grid grid-cols-2 gap-3">
{newDefaults.map((val, i) => (
<select
key={i}
value={val}
onChange={(e) => handleChange(i, e.target.value)}
className="bg-gray-800 p-2 rounded"
>
<option value="">Select Team {i + 1}</option>
{TEAMS.map(team => (
<option key={team} value={team}>{team}</option>
))}
</select>
))}
</div>

{/* BUTTON */}
<button
onClick={handleSubmit}
className="mt-5 bg-green-500 px-4 py-2 rounded"
>
Update Defaults
</button>

{/* ERROR / SUCCESS */}
{error && <div className="text-red-400 mt-3">{error}</div>}
{success && <div className="text-green-400 mt-3">{success}</div>}

</div>
);
}