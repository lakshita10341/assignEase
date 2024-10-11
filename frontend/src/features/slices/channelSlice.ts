import { createSlice } from "@reduxjs/toolkit";
import { addChannel, fetchChannels } from "../thunks/channelThunk";

interface Channel {
    channelid : string;
    channelName : string;
}

interface ChannelsState {
    channels : Channel[];
    loading : boolean;
    error : string | null ; 
}

const initialState : ChannelsState ={
    channels : [],
    loading : false,
    error : null,
};

const channelsSlice = createSlice({
    name : 'channels',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchChannels.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChannels.fulfilled, (state,action)=>{
                state.loading = false;
                state.channels = action.payload; 
            })
            .addCase(fetchChannels.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.error.message || "Failed to fetch Channels";
            })
            .addCase(addChannel.fulfilled, (state,action)=>{
                state.channels.push(action.payload);
            });
    },
});

export default channelsSlice.reducer;
