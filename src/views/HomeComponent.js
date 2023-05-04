import React from "react";
import "../css/HomePage.css";
import { useAuthValue } from "../AuthContext";
function HomeComponent() {
  const {currentUser} = useAuthValue()
  console.log(currentUser);
    return (
    <div className="home-container">
      <div className="content">
        <h1 style={{color:"white"}}>Welcome to Caldent</h1>
        <p style={{color:"white"}}>Calendar For students</p>
      </div>
    </div>
  );
}

export default HomeComponent;