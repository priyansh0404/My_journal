import { useState } from "react";
import "../style/signup.css";
import { useNavigate,NavLink } from "react-router-dom";
import { useEffect } from "react";

export default function Signup() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
        if(localStorage.getItem('login')){
          navigate("/")
        }
      })
  const handleSignup = async () => {
    console.log(userData);
    let result = await fetch(`${API_URL}/signup`, {
      method: "Post",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "Application/Json",
      },
    });
    result = await result.json();
    if (result.success) {
      console.log(result);
      document.cookie = "token = " + result.token;
      localStorage.setItem('login',userData.email);
      navigate('/');
    }
    else{
      alert("Try after sometime");
    }
  };

  return (
    <>
      <div className="container">
        <h1>Sign Up</h1>
        <label htmlFor="">Name</label>
        <input
          type="text"
          onChange={(event) =>
            setUserData({ ...userData, name: event.target.value })
          }
          placeholder="Enter your name"
          name="name"
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          onChange={(event) =>
            setUserData({ ...userData, email: event.target.value })
          }
          placeholder="Enter yoour email"
          name="email"
        />
        <label htmlFor="">Password</label>
        <input
          type="text"
          onChange={(event) =>
            setUserData({ ...userData, password: event.target.value })
          }
          placeholder="Enter your password"
          name="password"
        />
        <button onClick={handleSignup}>Signup</button>
        <NavLink to="/login">Login</NavLink>
      </div>
    </>
  );
}
