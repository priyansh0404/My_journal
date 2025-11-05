import { useState } from "react";

import "../style/addentry.css";
import { Navigate, useNavigate } from "react-router-dom";
export default function AddEntry() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
    const [taskData,setTaskData] = useState();
    const navigate = useNavigate();
    const handleAddTask = async() =>{
        console.log(taskData);
        let result = await fetch(`${API_URL}/add-entry`,{
            method:"Post",
            credentials:"include",
            body:JSON.stringify(taskData),
            headers:{
                'Content-Type':'Application/Json'
            } 
        })
        result = await result.json();
        if(result.success){
          alert("New data successfully added");
          navigate("/");
        }
        else{
          alert("Try after some time");
        }
    }
  return (
    <div className="box">
      <h1>Add Entry</h1>
        <div className="add-container">
          <input onChange={(event) => setTaskData({...taskData,date:event.target.value})} className="date" type="date" />
          <label htmlFor="">Title</label>
          <input onChange={(event) => setTaskData({...taskData,title:event.target.value})} className="input" type="text" placeholder="Enter Title" name="title" />
          <label htmlFor="">Description</label>
          <textarea onChange={(event) => setTaskData({...taskData,description:event.target.value})} className="text-input"
            placeholder="Enter Description" 
            name="description"
          ></textarea>
          <button onClick={handleAddTask}>Add Entry</button>
        </div>
      
    </div>
  );
}
