import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { authHeader } from './api';

function App() {

  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [data, setData] = useState(null)
  const [isRegister, setIsRegister] = useState(true)
  const [name, setName] = useState('')
 
  const API_URL = "http://localhost:3005"

  async function fetchWithToken(url){
    const response = await fetch(url, {
      headers: authHeader()
    });

    const result = await response.json();
    
    if(!response.ok){
      if(response.status === 401){
        localStorage.removeItem("token");
        setToken("");
        setData(null);
        alert("Session Expireed! Please login to continue.")
      }

      throw new Error(result.message)
    }
    return result;
  }

  const registerMethod = async () => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })

    const result = await response.json();
    if(!response.ok){
      alert(result.message);
      return;
    }

    // alert(result.message)

    setName("");
    setEmail("");
    setPassword("");
    setIsRegister(false);
    console.log(isRegister)
  }


  const loginMethod = async () => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const result = await response.json();
    if(!response.ok){
      console.log(result.message);
      setToken("");
      localStorage.removeItem("token");
      return;
    }
    setToken(result.token)
    console.log("result",result.token)
    localStorage.setItem("token",result.token)
    setEmail("")
    setPassword("")
    setIsRegister(false)
  }

  const getProfile = async () => {
    const tokenFromLS = localStorage.getItem("token")

    try{
      const result = await fetchWithToken(`${API_URL}/profile`);
      setData(result);
    }catch(err) {
      console.log(err.message)
    }
    
  } 

  const getDashboard = async () => {
    try{
      const result = await fetchWithToken(`${API_URL}/dashboard`);
      setData(result);
      console.log(result)
    }catch(err){
      console.log(err.message)
    }

  }

  const getSettings = async () => {
    try{
      const result = await fetchWithToken(`${API_URL}/settings`);
      setData(result);
      console.log(result)
    }catch(err){
      console.log(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setData(null);
    setName("");
    setEmail("");
    setPassword("");
    setIsRegister(false);
  }

  return (
    <div className="App">
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <div>
        {
          !token ? 
          <>
            {
              isRegister && 
              <>
                <input type='text' value={name} placeholder='Enter you name' onChange={(event) => {setName(event.target.value)}} />
                <br></br><br></br>
              </>
            }
            <input type='text' value = {email} placeholder='Enter you email' onChange={(event) => {setEmail(event.target.value)}}/>
            <br></br><br></br>
            <input type='password' value = {password} placeholder='Enter you password' onChange={(event) => {setPassword(event.target.value)}}/>
            <br></br><br></br>
            {isRegister ? 
              <button onClick={registerMethod}>Register</button> 
              : 
              <button onClick={loginMethod}>Login</button> 
            }

            <br></br><br></br>

            <p>{
              isRegister ? 'Already have an account? ' : "Don't have an Account ?"
              }
              <span
                style={{
                  color: "blue",
                  cursor: "pointer",
                  marginLeft: "5px",
                  textDecoration: "underline"
                }}
                onClick={()=>{
                  setIsRegister(!isRegister)
                  setName("")
                  setEmail("")
                  setPassword("")
                }}
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>
              
          </>
          :
          <>
            <button onClick={getProfile}>Get Profile</button>
            <button onClick={getDashboard}>Dashboard</button>
            <button onClick={getSettings}>Settings</button>
            {
              data && (
                <>
                  <h1>Hello {data.user.name}</h1>
                  <h3>{data.message}</h3>
                  <p>Your associated email is {data.user.email}</p>
                </>
              )
            }
            
            <button onClick={logout}>Logout</button>
          </>
        }
        
      </div>
    </div>
  );
}

export default App;
