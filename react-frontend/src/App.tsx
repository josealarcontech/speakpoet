import { RouterProvider } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material'
import { useAppSelector, useAppDispatch } from "./hooks";
import router from './router'
import './App.css'
import { clearToast } from "./features/toast/toastSlice";

function App() {
  const dispatch = useAppDispatch()
  const closeSnackbar = () => {
    dispatch(clearToast())
  }
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={useAppSelector(state => state.toast.toastActive)}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        <Alert severity={useAppSelector(state => state.toast.toastColor)} sx={{ width: '100%' }}>
          {useAppSelector(state => state.toast.toastMessage)}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default App
