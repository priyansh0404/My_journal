import { useState } from "react";
import "../style/login.css";
import { useNavigate,NavLink } from "react-router-dom";
import { useEffect } from "react";
export default function Login() {
  // Login.jsx (Using the environment variable)
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const[userData,setUserData] = useState();
    const navigate = useNavigate();
    useEffect(()=>{
      if(localStorage.getItem('login')){
        navigate("/")
      }
    })
    const handleLogin = async () => {
    console.log(userData);
    let result = await fetch(`${API_URL}/login`, {
      method: "Post",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "Application/Json",
      },
    });
    result = await result.json();
    if (result.success) {
      document.cookie = "token = " + result.token;
      localStorage.setItem('login',userData.email);
      window.dispatchEvent(new Event('localStorage-event'));
      navigate('/');
    }
    else{
      alert("Try after sometime");
    }
  };
  return (
    <>
      <div className="logincontainer">
        <h1>Login</h1>
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
          type="password"
          onChange={(event) =>
            setUserData({ ...userData, password: event.target.value })
          }
          placeholder="Enter your password"
          name="password"
        />
        <button onClick={handleLogin}>Login</button>
        <NavLink to="/signup">Signup</NavLink>
      </div>
    </>
  );
}
