import React, { useEffect, useState } from "react"
import api from '../../api'
import { addChannelRoute, getChannelsRoute } from "@/routes/route"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface channel{
  channelid: string,
  channelName: string,
}

const Home : React.FC = ()=>{
   const [channels, getChannels] = useState<channel[]>([])
   const [name, setName] = useState('');
    useEffect(()=>{
        const fetchChannels = async()=>{
            try{
                const response = await api.get(getChannelsRoute);          
                console.log(response)
                getChannels(response.data)
            }catch(err){
                console.log(err);
            }
         
        }
        fetchChannels();       
    },[])
    const handleClick =()=>{
        
    }
    const addChannels = async(e:React.FormEvent)=>{
        e.preventDefault()
        try{
            const res = await api.post(addChannelRoute, {"channelName": name})
            if(res.status===201){
                console.log(res.data)
            }else{
                console.log(res)
            }
        }catch(err){
            console.log(err);
        }

    }

    return (
        <>
        <div className="w-screen h-screen relative">
    
    <div className="w-16 h-16 rounded-full bg-black border-inherit absolute top-4 right-4"></div>

  <div className="overflow-y-auto overflow-x-hidden h-96 absolute top-20 w-full">
    {
        channels.map((channel)=><div className='w-full py-2 text-lg font-bold bg-sky-950 rounded-sm text-white flex items-center justify-center m-1' key={channel.channelid} onClick={handleClick}>{channel.channelName}</div>)
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