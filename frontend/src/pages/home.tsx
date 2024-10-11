import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import commonAvatar from '../components/common.png';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { addChannel, fetchChannels } from "@/features/thunks/channelThunk"
import { fetchProfile } from "@/features/thunks/profileThunk"

// interface channel{
//   channelid: string,
//   channelName: string,
// }

const Home : React.FC = ()=>{

   const [name, setName] = useState('');
   const dispatch = useDispatch<AppDispatch>();
   const channels = useSelector((state: RootState)=>state.channels.channels);
   const loading = useSelector((state: RootState)=>state.channels.loading)
   const profile = useSelector((state: RootState)=> state.profile.user); 
  
   const avatarUrl = profile?.avatar || commonAvatar
   const username = profile?.username || "Guest"
   useEffect(()=>{
    dispatch(fetchChannels());
    dispatch(fetchProfile());
   },[dispatch]);
    // useEffect(()=>{
    //     const fetchChannels = async()=>{
    //         try{
    //             const response = await api.get(getChannelsRoute);          
    //             console.log(response)
    //             getChannels(response.data)
    //         }catch(err){
    //             console.log(err);
    //         }
         
    //     }
    //     fetchChannels();       
    // },[])
    const handleClick =()=>{
        
    }
    const addChannels = async(e:React.FormEvent)=>{
        e.preventDefault()
       if(name){
        dispatch(addChannel(name));
        setName('');
       }

    }

    return (
        <>
        <div className="w-screen h-screen relative">

        <div className="flex items-center absolute top-4 right-4">
       
            <span>{username}</span>
            <img src = {avatarUrl} alt = "User avatar" className="w-16 h-16 rounded-full border-gray-300" />
           
         
        </div>



   
  <div className="overflow-y-auto overflow-x-hidden h-96 absolute top-20 w-full">
    { loading ? 
          <p>Loading...</p> :

        (channels.map((channel)=><div className='w-full py-2 text-lg font-bold bg-sky-950 rounded-sm text-white flex items-center justify-center m-1' key={channel.channelid} onClick={handleClick}>{channel.channelName}</div>))
    }
</div> 
       <div className="absolute bottom-4 right-4">
       <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Channel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channels</DialogTitle>
         
        </DialogHeader>
        <form onSubmit={addChannels}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Channel Name
            </Label>
            <Input id="name" value={name} onChange={(e)=>{setName(e.target.value)}} className="col-span-3" />
          </div>
         
        </div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>
      </DialogContent>
      
    </Dialog>
    </div>
    </div>
        </>
    )
}
export default Home