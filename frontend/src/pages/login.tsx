import React, { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
import type {AppDispatch, RootState} from '@/redux/store'
import { useDispatch, useSelector } from "react-redux"
import LoginRegister from '@/components/loginRegister'
import { userLogin } from "@/features/thunks/userAuth"
import Cookies from 'js-cookie'

const Login : React.FC=()=>{
    const [username, setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [formError, setFormError] = useState('')
    const dispatch: AppDispatch = useDispatch();

const {loading, error} = useSelector((state: RootState)=> state.userReducer);
    useEffect(()=>{
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
    },[])
    const navigate = useNavigate();
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        if(!username || !password ){
          setFormError("Please fill all fields");
          return;
        }
   
        setFormError("");
      
        const loginData = {
          username,
          password,
        }
      
            try{
            const resultAction = await dispatch(userLogin(loginData)).unwrap();
            console.log(resultAction)
              navigate('/')
      
            }catch(error:any){
              setFormError(error.message)
            }
    }

    const loginWithChanneli = async()=>{
      console.log("Button pressed")
      window.location.href = "http://127.0.0.1:8000/api/oauth/"
    
    }

    const loginWithGoogle=async()=>{
      window.location.href="http://127.0.0.1:8000/api/googleAuth/"
    }

    return (
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
    </div>
       
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
          </div>
         
        <Button type='submit' disabled={loading} >Create</Button>
     
        </form>
        <div>
        <Button variant={"outline"} onClick={loginWithGoogle} className="flex item-center rounded-md px-4 py-2">
            <img src={google} className="w-6 h-6 mr-2" alt='logo'/>
            <span className="text-sm font-medium">Sign in with Google</span>
          </Button>
          <Button variant={"outline"} onClick={loginWithChanneli} className="flex item-center rounded-md px-4 py-2">
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
export default Login