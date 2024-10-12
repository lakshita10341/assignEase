import { addChannelRoute, getChannelsRoute } from "@/routes/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

export const fetchChannels = createAsyncThunk('channels/fetchChannels',
    async()=>{
       try{
        const response = await api.get(getChannelsRoute);
        return response.data;
       }catch(error:any){
        
       }
    }
);

export const addChannel = createAsyncThunk('channels/addChannels',
    async (channelName : string)=>{
        const response = await api.post(addChannelRoute, {channelName});
        return response.data;
    }
)