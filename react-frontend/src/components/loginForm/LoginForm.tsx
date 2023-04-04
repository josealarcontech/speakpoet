import { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { loginUser } from '../../utils/auth'
import { apiCall } from '../../utils/fetch'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { toStoreData } from '../../views/loginView/LoginView'
import { useAppDispatch } from '../../hooks'
import './LoginForm.css'
import { setToast } from '../../features/toast/toastSlice'
import { useNavigate } from "react-router-dom";

interface loginData {
  email: string
  password: string
  uid?: string
}
interface loginFormProps {
  storeData: (data: toStoreData) => void
}
export default function LoginView({ storeData = (d) => {} }: loginFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [emailErrorText, setEmailErrorText] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const validateEmail = () => {
    if(!(!!email)) {
      setEmailErrorText('E-mail is required')
      setEmailError(true)
      return false
    }
    if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) {
      setEmailErrorText('E-mail must be valid')
      setEmailError(true)
      return false
    }
    setEmailErrorText('')
    setEmailError(false)
    return true
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const login = async() => {
    try {
      const valid = validateEmail()
      if (!valid) return
      setLoading(true)
      let data : loginData = {
        email: email,
        password: password
      }
      const loginRes = await loginUser(data)
      data.uid = loginRes?.uid
      const dbRes = await apiCall('/login', 'POST', false, data)
      const toStore: toStoreData = {
        token: loginRes?.token,
        imageUrl: dbRes.imageUrl,
        expire: loginRes?.expirationTime,
        email: dbRes.email,
        alias: dbRes.alias
      }
      storeData(toStore)
      setLoading(false)
      navigate('/')
    } catch (error) {
      setLoading(false)
      dispatch(setToast({toastInfo: {toastMessage: error as string, toastColor: 'error'}}))
    }
  }
  return (
    <div>
      <TextField fullWidth margin="dense" error={emailError} label="Email" variant="outlined" helperText={emailErrorText || ' '} value={email} onChange={(e) => {
          setEmail(e.target.value);
          validateEmail();
      }}/>
      <TextField fullWidth  type={showPassword ? 'text' : 'password'} label="Password" variant="outlined" value={password} onChange={(e) => {
          setPassword(e.target.value);
      }}
      InputProps={{
      endAdornment:
        <InputAdornment position="end">
          <IconButton
            onClick={toggleShowPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }}
      />
      <LoadingButton fullWidth variant="contained" className='login-button' loading={loading} onClick={() =>login()}>Login</LoadingButton>
    </div>
  )
}