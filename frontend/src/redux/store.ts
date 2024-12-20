import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/features/slices/userSlice'
import channelsReducer from '@/features/slices/channelSlice'
import profileReducer from '@/features/slices/profileSlice'
import assignmentsReducer from '@/features/slices/assignmentSlice'
import selectChannelReducer from '@/features/slices/selectedChannel'
import membersReducer from '@/features/slices/memberSlice' 
import usersReducer from '@/features/slices/getUserSlice'
import submissionsReducer from "@/features/slices/submissionSlice";

export const store = configureStore({
  reducer: {
    userReducer,
    channels : channelsReducer,
    profile : profileReducer,
    assignments : assignmentsReducer,
    selectChannel : selectChannelReducer,
    member : membersReducer,
    users : usersReducer,
    submissions : submissionsReducer,
  } ,
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch