
import { createAssignmentRoute } from "@/routes/route"
import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../../api"

interface assignmentData{
    title: string,
    description: string,
    deadline: Date,
    channel_id : string | null,
    attachments : File | null,
}

export const createAssignment = createAsyncThunk<
    void,
    assignmentData,
    {rejectValue: string}
>(
    "assignments/createAssignments/",
        async(assignmentData, {rejectWithValue})=>{
            try{
                
                const response = await api.post(createAssignmentRoute, assignmentData,{headers: {
                    "Content-Type": "multipart/form-data",
                }});
                return response.data;
            }catch(error: any){
                    return rejectWithValue(error.response.data.detail)
            }
        }
);