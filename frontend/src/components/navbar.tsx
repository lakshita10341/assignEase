import {useSelector , useDispatch } from "react-redux";
import React, { useEffect} from "react"
import commonAvatar from '../components/common.png';
import { AppDispatch, RootState } from "@/redux/store"
import { fetchProfile } from "@/features/thunks/profileThunk";

const Navbar : React.FC = ()=>{
    const profile = useSelector((state: RootState)=> state.profile.user); 
    const dispatch = useDispatch<AppDispatch>();
    const avatarUrl = profile?.avatar || commonAvatar
    const username = profile?.username || "Guest"

    useEffect(()=>{
        dispatch(fetchProfile());
    },[dispatch])

    return (
        <>
        <div className="flex items-center absolute top-4 right-4">
       
       <span>{username}</span>
       <img src = {avatarUrl} alt = "User avatar" className="w-16 h-16 rounded-full border-gray-300" />
      
    
   </div>
        </>
    );
}
export default Navbar;