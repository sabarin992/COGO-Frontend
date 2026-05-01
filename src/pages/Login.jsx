import React, { useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

const Login = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleLogin = async()=>{
        try {
            const res = await api.post("/auth/login",{email,password});
            toast.success("Login successful!")
            console.log(res.data);
            
        } catch (error) {
            console.log(error.response);
            
        }
    }
  return (
    <>

        <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button onClick={handleLogin}>Login</button>
    </>
  )
}

export default Login