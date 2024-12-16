import { addMemberRoute, getMemberRoute } from "@/routes/route"
import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../api"

interface Member {
    memberName: string,
    is_moderator: boolean,
    is_student: boolean,
    is_reviewer: boolean,
}

interface AddMemberPayload {
    membersData: Member[],
    channel_id: string | null,
}
interface channel{
    channel_id : string | null,
}
export const addMembers = createAsyncThunk(
    'members/addMembers',
    async(memberData : AddMemberPayload)=>{
        console.log(memberData)
        const response = await api.post(addMemberRoute, memberData)
        return response.data;
    }
)

export const fetchMembers = createAsyncThunk(
    'members/addMembers/',
    async(channelData : channel)=>{
            const response = await api.get(`${getMemberRoute}?channel_id=${channelData.channel_id}` );
            console.log(response.data)
            return response.data;
    }
)




