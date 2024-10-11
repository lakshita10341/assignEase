import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/features/slices/userSlice'
import channelsReducer from '@/features/slices/channelSlice'
import profileReducer from '@/features/slices/profileSlice'


export const store = configureStore({
  reducer: {
    userReducer,
    channels : channelsReducer,
    profile : profileReducer,
  } ,
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch