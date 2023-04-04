import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface tokenInfo {
  token: string
  tokenExpirationDate: string
}
const initialState: tokenInfo = {
 token: "",
 tokenExpirationDate: ""
}

export const TokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    clearToken: (state) => {
			state.token = ''
			state.tokenExpirationDate = ''
		},
    setToken:(state, action: PayloadAction<{token: string}>) => {
			state.token = action.payload.token
		},
    setTokenExpirationDate: (state, action: PayloadAction<{tokenExpirationDate: string}>) => {
			state.tokenExpirationDate = action.payload.tokenExpirationDate
		}
  },
})

// Action creators are generated for each case reducer function
export const { clearToken, setToken, setTokenExpirationDate } = TokenSlice.actions

export default TokenSlice.reducer