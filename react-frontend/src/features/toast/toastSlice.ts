import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface toastInfo {
  toastActive?: boolean
  toastMessage: string
  toastColor: string
}

const initialState: toastInfo = {
 toastActive: false,
 toastColor: 'success',
 toastMessage: ''
}

export const ToastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    clearToast: (state) => {
			state.toastActive = false
		},
    setToast:(state, action: PayloadAction<{toastInfo: toastInfo}>) => {
			state.toastActive = true
			state.toastColor = action.payload.toastInfo.toastColor
			state.toastMessage = action.payload.toastInfo.toastMessage
		},
  },
})

export const { clearToast, setToast, } = ToastSlice.actions

export default ToastSlice.reducer