"use client";

import { useState } from "react";
import axios from "axios";

const teams = ["MI","CSK","RCB","KKR","SRH","DC","RR","LSG","PBKS","GT"];

export default function Register() {

const [mobile, setMobile] = useState("");
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [defaults, setDefaults] = useState(Array(10).fill(""));
const [loading, setLoading] = useState(false);

const updateDefault = (index, value) => {
const copy = [...defaults];
copy[index] = value;
setDefaults(copy);
};

const validate = () => {
if (!mobile || mobile.length < 10) {
alert("Enter valid mobile number");
return false;
}

if (!name) {
alert("Enter name");
return false;
}

if (!password || password.length < 4) {
alert("Password too short");
return false;
}

const uniqueTeams = new Set(defaults);
if (uniqueTeams.size !== 10) {
alert("Select all 10 different teams");
return false;
}

return true;
};

const register = async () => {

if (!validate()) return;

try {
setLoading(true);

await axios.post(
`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
{
mobile,
name,
password,
defaults,
}
);

alert("Registered successfully");
window.location.href = "/login";

} catch (err) {

console.log("FULL ERROR:", err);

let msg = "Registration failed";

if (err.response) {
const data = err.response.data;

// Handle multiple backend formats
if (typeof data === "string") {
msg = data;
} else if (data.error) {
msg = data.error;
} else if (data.message) {
msg = data.message;
}
}

alert(msg);
} finally{setLoading(false)};
};

return (
<div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">

<div className="bg-[#111827] p-8 rounded-2xl w-full max-w-lg shadow-xl">

<h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
🏏 Register
</h1>

<input
placeholder="Mobile"
value={mobile}
onChange={(e) => setMobile(e.target.value)}
className="w-full mb-3 p-3 rounded-lg bg-[#1f2937] border border-gray-700"
/>

<input
placeholder="Name"
value={name}
onChange={(e) => setName(e.target.value)}
className="w-full mb-3 p-3 rounded-lg bg-[#1f2937] border border-gray-700"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full mb-6 p-3 rounded-lg bg-[#1f2937] border border-gray-700"
/>

<h2 className="text-yellow-400 mb-3">
Default Teams (Priority Order)
</h2>

<div className="grid grid-cols-2 gap-3 mb-6">
{defaults.map((d, i) => (
<select
key={i}
value={d}
onChange={(e) => updateDefault(i, e.target.value)}
className="p-2 rounded-lg bg-[#1f2937] border border-gray-700"
>
<option value="">Rank {i + 1}</option>
{teams.map((t) => (
<option key={t}>{t}</option>
))}
</select>
))}
</div>

<button
onClick={register}
disabled={loading}
className="w-full bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-lg font-bold disabled:opacity-50"
>
{loading ? "Registering..." : "Register"}
</button>

</div>

</div>
);
}