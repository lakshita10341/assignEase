import { createSlice } from "@reduxjs/toolkit";

interface selectedChannelState{
    selectedChannelId : string | null;
}
const initialState : selectedChannelState={
    selectedChannelId : null,
}
const selectChannelSlice = createSlice({
    name : 'selectChannel',
    initialState,
    reducers : {
       setSelectedChannel : (state, action)=>{
            console.log(action.payload)
            state.selectedChannelId = action.payload;
       } 
    }
})

export const {setSelectedChannel} = selectChannelSlice.actions;
export default selectChannelSlice.reducer;