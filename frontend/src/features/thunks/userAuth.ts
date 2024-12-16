import { registerRoute, loginRoute } from '@/routes/route'
import {createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'


interface RegisterFormData{
    username:string;
    email: string;
    password: string;
}

interface LoginFormData{
    username:string;
    password:string;
}

interface AuthResponse{
    access: string;
    refresh: string;
}


export const registerUser = createAsyncThunk<
void,
RegisterFormData,
{rejectValue: string}
>(
    'user/register/',
    async(formData, {rejectWithValue})=>{
        try{
            const response = await axios.post(registerRoute,formData);
            if(response.status === 201){

                console.log("User registered successfully")
                const loginData = {username: formData.username, password: formData.password}
                try{
                  const {data} = await axios.post<AuthResponse>(loginRoute, loginData)
                  Cookies.set('access_token',data.access,{expires:7}),
                  Cookies.set('refresh_token',data.refresh,{expires:7}),
                  console.log(Cookies.get('access_token'))
                
          
                }catch(error:any){
                  console.log("error in token fetch: ", error.message)
                }
          
              }else{
                
               
          
              }
        }catch(error:any){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue("Some error occured");
            }
        }
    }
)

export const userLogin= createAsyncThunk<
void,
LoginFormData,
{rejectValue:string}
>(
    'user/login/',
    async(LoginFormData, {rejectWithValue})=>{
        try{
            const {data} = await axios.post<AuthResponse>(loginRoute, LoginFormData)
            Cookies.set('access_token',data.access,{expires:7}),
            Cookies.set('refresh_token',data.refresh,{expires:7})
    
          }catch(error:any){
            console.log(error.response.data.detail)
            return rejectWithValue(error.response.data.detail)
          }
    }
)
