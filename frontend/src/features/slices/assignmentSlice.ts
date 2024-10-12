import { createSlice } from "@reduxjs/toolkit";
import { createAssignment } from "../thunks/assignmentThunk";

interface Assignment{
    id : string,
    title : string,
    description : string,
    deadline : Date,
}

interface AssignmentsState{
    assignments : Assignment[],
    loading : boolean;
    error  : string | null,
}

const initialState: AssignmentsState = {
    assignments: [],
    loading : false,
    error : null,
}

const assignmentSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder
            .addCase(createAssignment.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createAssignment.fulfilled,(state)=>{
                state.loading = false;
                state.error = null;
            })
            .addCase(createAssignment.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload || "Something went wrong"
            })
    }
})
export default assignmentSlice.reducer;