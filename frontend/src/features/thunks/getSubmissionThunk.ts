import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { getSubmission } from "@/routes/route";

interface Submission {
    submission_id: number;
    submission_text: string;
    submission_file: string | null;
    submit_date: string;  
}
interface DataProps {
    data: {
        group_id: number;
        assignment_id: number;
        role:string;
    };
}


export const fetchSubmissions = createAsyncThunk<
    Submission[],       
    DataProps,        
    { rejectValue: string } 
>(
    'submissions/fetchSubmissions/',
    async ({data}, { rejectWithValue }) => {
        try {
            const response = await api.get(getSubmission,{params : data});
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || "Failed to fetch submissions");
        }
    }
);
