import { createSlice } from "@reduxjs/toolkit"
import { addMembers, fetchMembers } from "../thunks/participantsThunk";

interface MemberData{
    id : string,
    username : string,
    avatar : string,
    bio : string,
}

interface Member{
    memberid : string,
    memberName : MemberData,  
    is_moderator : boolean,
    is_admin : boolean,
    is_student : boolean,
    is_reviewer : boolean,
}

interface MembersState{
    member : Member[],
    memberloading:boolean,
    membererror : string | null,
}

const initialState : MembersState={
    member : [],
    memberloading : false,
    membererror : null,
}

const membersSlice = createSlice({
    name : 'members',
    initialState,
    reducers : {},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchMembers.pending, (state)=>{
                state.memberloading=true;
                state.membererror = null;
            })
            .addCase(fetchMembers.fulfilled,(state,action)=>{
                console.log(action.payload)
                state.memberloading=false;
                state.member = action.payload;
            })
            .addCase(fetchMembers.rejected,(state,action)=>{
                state.memberloading=false;
                state.membererror=action.error.message || "Failed to fetch Members. Please try again after some time"
            })
            .addCase(addMembers.fulfilled,(state,action)=>{
                state.member.push(action.payload)
            })
    }
})

export default membersSlice.reducer;
