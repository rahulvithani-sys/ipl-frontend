"use client"

import {useState} from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function Defaults(){

 const [teams,setTeams] = useState([])

 const save = async ()=>{

  const user = JSON.parse(localStorage.getItem("user"))

  await axios.post(
   "http://localhost:5000/defaults/set",
   {
    user_id:user.id,
    teams
   }
  )

  alert("Defaults Saved")

 }

 return(

  <div>

   <Navbar/>

   <div style={{padding:"40px"}}>

    <h2>Default Team Order</h2>

    {Array.from({length:10}).map((_,i)=>(
     <input
      key={i}
      placeholder={`Position ${i+1}`}
      onChange={(e)=>{

       const arr=[...teams]
       arr[i]=e.target.value
       setTeams(arr)

      }}
     />
    ))}

    <br/><br/>

    <button onClick={save}>Save</button>

   </div>

  </div>

 )
}