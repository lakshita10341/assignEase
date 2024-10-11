import { getProfileRoute } from "@/routes/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async()=>{
        const response = await api.get(getProfileRoute);
        return response.data;
    }
);