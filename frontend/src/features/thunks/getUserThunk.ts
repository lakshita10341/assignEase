import { getUserRoute } from "@/routes/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api"

interface user{
    id : string,
    username : string,
    avatar : string | null,
}
interface Users {
    user : user,
}

export const getUsers = createAsyncThunk(
    'user/getUsers',
    async()=>{
        const response = await api.get(getUserRoute)
        return response.data;
    }
)