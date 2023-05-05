import { useState,useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavComponent from "./views/Navbar";
import HomeComponent from "./views/HomeComponent";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import {auth} from "./firebase/firebaseConfig"
import {onAuthStateChanged} from 'firebase/auth'

import { AuthProvider } from "./AuthContext";
import Calendar from "./views/Calender";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
     })
  }, [])
  return (
    <div className="App">
      <AuthProvider value={{ currentUser }}>
        <BrowserRouter>
          <NavComponent />
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/calendar" element={<Calendar/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}


export default App;
