// import { fetchAssignmentRoute } from "@/routes/route";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../../api";

// export const fetchAssignments = createAsyncThunk(
//     'assignments/fetchAssignments/',
//     async(channelName : string)=>{
//         const response = await api.get(`${fetchAssignmentRoute}?=${channelName}`);
//         return response.data;
//     }
// )
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { fetchAssignmentRoute } from "@/routes/route";

// Define the type for the data returned by the API
interface Assignment {
    assignment_id: number;
    title: string;
    description: string;
    deadline: Date;
    attachment : null;
}

// Create thunk to fetch assignments
export const fetchAssignments = createAsyncThunk<
    Assignment[],  // Success type (array of assignments)
    string | null,        // Argument type (channelName)
    { rejectValue: string }  // Error type (string)
>(
    'assignments/fetchAssignments/',
    async (channelName, { rejectWithValue }) => {
        try {
            const response = await api.get(`${fetchAssignmentRoute}?channelName=${channelName}`);
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || "Failed to fetch assignments");
        }
    }
);
