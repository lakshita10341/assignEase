import { createSlice } from "@reduxjs/toolkit";
import { registerUser, userLogin } from "../thunks/userAuth";

interface UserState{
    loading: boolean;
    error: string | null;
}

const initialState : UserState= {
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers:{},
    extraReducers : (builder)=>{
        builder
            .addCase(registerUser.pending,(state)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled,(state)=>{
                state.loading=false;
            })
            .addCase(registerUser.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })
            .addCase(userLogin.pending,(state)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled,(state)=>{
                state.loading=false;
            })
            .addCase(userLogin.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })
    }
})
export default userSlice.reducer;