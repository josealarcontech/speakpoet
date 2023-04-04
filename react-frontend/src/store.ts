import { configureStore } from '@reduxjs/toolkit'
import { TokenSlice } from './features/token/tokenSlice'
import { UserSlice } from './features/user/userSlice';

const store = configureStore({
  reducer: {
    token: TokenSlice.reducer,
    user: UserSlice.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store;