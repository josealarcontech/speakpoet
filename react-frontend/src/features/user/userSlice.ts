import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface userInfo {
  profileImage: string
  userAlias: string
  userEmail: string
}
const initialState: userInfo = {
  profileImage: '',
  userAlias: '',
  userEmail: ''
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setImage:(state, action: PayloadAction<{profileImage: string}>) => {
			state.profileImage = action.payload.profileImage
		},
    setUserAlias: (state, action: PayloadAction<{userAlias: string}>) => {
			state.userAlias = action.payload.userAlias
		},
		setUserEmail: (state, action: PayloadAction<{userEmail: string}>) => {
			state.userEmail = action.payload.userEmail
		},
    clearUser: (state) => {
			state.profileImage = ''
			state.userAlias = '',
			state.userEmail = ''
		}
  },
})

// Action creators are generated for each case reducer function
export const { setImage, setUserAlias, setUserEmail, clearUser } = UserSlice.actions

export default UserSlice.reducer