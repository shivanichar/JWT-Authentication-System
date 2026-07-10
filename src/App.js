import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { authHeader } from './api';

function App() {

  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "")
  const [data, setData] = useState(null)
  const [isRegister, setIsRegister] = useState(true)
  const [name, setName] = useState('')
 
  const API_URL = "http://localhost:3005"

  async function fetchWithToken(url){
    let response = await fetch(url, {
      headers: authHeader()
    });

    if(response.status === 401) {
      console.log("Access token expired!");
      console.log("Refreshing token....")
    

      const newAccessToken = await refresh();

      if(!newAccessToken){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setToken("");
        setData("");
        alert("Session expired, please login again.")

        throw new Error("Session expired")
      }
    

      console.log("Token refreshed successfully.");

      response = await fetch(url,{
        headers: authHeader()
      })
    }

    const result = await response.json();
    
    if(!response.ok){
      if(response.status === 401){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setToken("");
        setData(null);
        alert("Session Expired! Please login to continue.")
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return;
    }
    setToken(result.accessToken)
    console.log("Access result",result.accessToken)
    console.log("Refresh result",result.refreshToken)
    localStorage.setItem("accessToken",result.accessToken)
    localStorage.setItem("refreshToken", result.refreshToken)
    setEmail("")
    setPassword("")
    setIsRegister(false)
  }

  const getProfile = async () => {

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

  const refresh = async () =>{
    try{
      const refreshToken = localStorage.getItem("refreshToken")

      if(!refreshToken){
        throw new Error ("No refresh token found!")
      }

      const response = await fetch(`${API_URL}/refresh`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          refreshToken
        })

      })

      const result = await response.json();
      if(!response.ok){
        throw new Error("result.message")
      }

      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      setToken(result.accessToken)

      return result.accessToken;

    }catch(err){
      console.log(err.message);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setToken("");
      setData(null);

      alert("Session expired. Please login again.");

      return null;
    }
  }

  const logout = async () => {
    try{
        const response = await fetch(`${API_URL}/logout`,{
        method: "POST",
        headers: authHeader(),
      });
    } catch(err){
      console.log(err.message)
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken")
      setToken("");
      setData(null);
      setName("");
      setEmail("");
      setPassword("");
      setIsRegister(false);
    }
  }

  return (
    <div className="App">
      {(isRegister && !token) && ( <h1>Register</h1> ) }
      {(!isRegister && !token) && ( <h1>Login</h1> ) }
      {(token) ? <h1>Welcome Back</h1> : ""}
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
