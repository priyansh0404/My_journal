import { useEffect } from "react"; 
import "../style/addentry.css"
import { useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
export default function UpdateEntry() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [taskData, setTaskData] = useState();
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(()=>{
    fetchEntry(id);
  },[]);
  const fetchEntry = async (id) => {
    let data = await fetch(`${API_URL}/entry/`+id,{
      credentials:'include', 
    });
     
    data = await data.json();
    
    if(data.result){
        setTaskData(data.result);     
    }
  };

  const UpdateEntry = async()=>{
    let entry = await fetch(`${API_URL}/update-entry`,{
      method:'PUT',
      body:JSON.stringify(taskData),
      credentials:'include',
      headers:{
        'Content-Type' : 'application/json'
      },
      
    });
    entry = await entry.json();
    if(entry.success){
      navigate("/");
    }
  }

  return (
    <div className="box">
      <h1>Update Entry</h1>
      <div className="add-container">
        <label htmlFor="">Title</label>
        <input
          onChange={(event) =>
            setTaskData({ ...taskData, title: event.target.value })
          }
          className="input"
          type="text"  
          placeholder="Enter Title"
          name="title"
          value={taskData?.title}
        />
        <label htmlFor="">Description</label>
        <textarea
          onChange={(event) =>
            setTaskData({ ...taskData, description: event.target.value })
          }
          className="text-input"
          placeholder="Enter Description"
          name="description"
          value={taskData?.description}
        ></textarea>
        <button onClick={UpdateEntry}>Update Entry</button>
      </div>
    </div>
  );
}
