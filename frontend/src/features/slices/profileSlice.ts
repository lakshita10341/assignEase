import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from "../thunks/profileThunk";

interface ProfileState {
    user : {
        username : string;
        email : string;
        avatar : string | null;
        bio : string | null;
    } | null ;
    loading : boolean;
    error : string | null;
}
const initialState : ProfileState = {
    user : null,
    loading : false,
    error : null,

}

const profileSlice = createSlice({
    name : 'profile',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchProfile.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state,action)=>{
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.error.message || "Failed to fetch profile";
            });
    }
});
export default profileSlice.reducer;