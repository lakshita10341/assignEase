
import { createAssignmentRoute } from "@/routes/route"
import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../../api"

interface assignmentData{
    title: string,
    description: string,
    deadline: Date,
    channel_id : string | null,
}


export const createAssignment = createAsyncThunk<
    void,
    assignmentData,
    {rejectValue: string}
>(
    "assignments/createAssignments/",
        async(assignmentData, {rejectWithValue})=>{
            try{
                console.log(assignmentData.deadline)
                const response = await api.post(createAssignmentRoute, assignmentData);
                return response.data;
            }catch(error: any){
                    return rejectWithValue(error.response.data.detail)
            }
        }
);