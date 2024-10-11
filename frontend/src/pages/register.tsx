import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type {AppDispatch, RootState} from '@/redux/store'
import { useDispatch, useSelector } from "react-redux"

import {
    Card,
    CardContent,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
import imglogo from "../components/imglogo.svg"
import google from "../components/google.webp"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import LoginRegister from "@/components/loginRegister"
import { registerUser } from "@/features/thunks/userAuth"

const Register : React.FC=()=>{
const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [password,setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [formError, setFormError] = useState('')
const navigate = useNavigate();
const dispatch: AppDispatch = useDispatch();
const {loading, error} = useSelector((state: RootState)=> state.userReducer);

const handleSubmit =async(e:React.FormEvent)=>{
  e.preventDefault();
  if(!username || !email || !password || !confirmPassword){
    setFormError("Please fill all fields");
    return;
  }
  if(password != confirmPassword){
    setFormError("Passwords do not match")
  }
  setFormError("");
  const formData = {
    username,
    password,
    email,
    
  };
  try{
    const resultAction  = await dispatch(registerUser(formData)).unwrap();
     console.log(resultAction)
      navigate('/');
    
  }catch(err){
    console.error('Failed to register user',err);
  }
 
}

const loginWithChanneli = async()=>{
  console.log("Button pressed")
  window.location.href = "http://127.0.0.1:8000/api/oauth/"

}
    return(
        <>
        <div className="bg-gray-300 flex flex-row items-center w-screen">
    <LoginRegister></LoginRegister>

        <div className="h-1/2 "></div>
        <Card>
 <CardTitle>Create your account </CardTitle>
  <CardContent>
    <form onSubmit={handleSubmit}>
     {formError && (<div className="text-red-500">{formError}</div>)}
      {error && (<div className="text-red-500">{error}</div>)}
  <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Username" className="text-right">
              Username
            </Label>
            <Input id="Username" value={username} onChange={(e)=>setUsername(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Email" className="text-right">
              Email
            </Label>
            <Input id="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Confirm Password
            </Label>
            <Input id="confirmpassword" value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <Button type='submit' disabled={loading}>Create</Button>
      
        </form>
        <div>
        <Button variant={"outline"} className="flex item-center rounded-md px-4 py-2">
            <img src={google} className="w-6 h-6 mr-2" alt='logo'/>
            <span className="text-sm font-medium">Sign in with Google</span>
          </Button>
          <Button variant={"outline"} onClick={loginWithChanneli}  className="flex item-center rounded-md px-4 py-2">
            <img src={imglogo} className="w-6 h-6 mr-2" alt='logo'/>
            <span className="text-sm font-medium">Sign in with Channeli</span>
          </Button>
        </div>
  </CardContent>

</Card>

    </div>
        </>
    )
}
export default Register
