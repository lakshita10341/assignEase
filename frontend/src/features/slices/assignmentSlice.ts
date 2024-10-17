import { createSlice } from "@reduxjs/toolkit";
import { createAssignment } from "../thunks/assignmentThunk";
import { fetchAssignments } from "../thunks/fetchAssignmentThunk";

interface Assignment{
    assignment_id : number,
    title : string,
    description : string,
    deadline : Date,
    attachment: null;
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
            .addCase(fetchAssignments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload;
                state.error = null;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch assignments";
            });
    }
})
export default assignmentSlice.reducer;