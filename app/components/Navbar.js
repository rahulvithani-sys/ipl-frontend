"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
const [user, setUser] = useState(null);

useEffect(() => {
const u = JSON.parse(localStorage.getItem("user"));
setUser(u);
}, []);

const handleLogout = () => {
localStorage.removeItem("user");
window.location.href = "/login";
};

return (
<div className="bg-[#0b0f1a] border-b border-gray-800 px-6 py-3 text-yellow-400">

{/* TOP BAR */}
<div className="flex justify-between items-center mb-3">

<div className="text-xl font-bold">
🏏 IPL Predictor
</div>

<div className="flex items-center gap-4">



{/* AVATAR */}
<div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black">
{user?.name?.[0]?.toUpperCase() || "U"}
</div>

{/* LOGOUT */}
<button
onClick={handleLogout}
className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
>
Logout
</button>

</div>
</div>

{/* NAV LINKS */}
<div className="flex gap-6 text-sm font-medium">

<Link href="/dashboard" className="hover:text-yellow-300">
🏏 Predict
</Link>

<Link href="/leaderboard" className="hover:text-yellow-300">
🏆 Leaderboard
</Link>

<Link href="/history" className="hover:text-yellow-300">
📜 History
</Link>

<Link href="/admin" className="hover:text-yellow-300">
⚙️ Admin
</Link>

</div>

</div>
);
}