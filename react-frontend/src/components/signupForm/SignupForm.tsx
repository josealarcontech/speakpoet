import { useMemo, useState } from 'react'
import { TextField } from '@mui/material'
import './SignupForm.css'
import { apiCall } from '../../utils/fetch'
import { registerUser } from '../../utils/auth'
import { LoadingButton } from '@mui/lab'
import { toStoreData } from '../../views/loginView/LoginView'
import { useAppDispatch } from '../../hooks'
import { setToast } from '../../features/toast/toastSlice'
interface registerData {
  email: string
  password: string
  lastname: string
  name: string
  alias: string
  uid?: string
}

interface signupFormProps {
  storeData: (data: toStoreData) => void
}
export default function SignupView({ storeData = (d) => {} }: signupFormProps) {
  const dispatch = useAppDispatch()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [alias, setAlias] = useState('')
  const [emailErrorText, setEmailErrorText] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordConfirmationErrorText, setPasswordConfirmationErrorText] = useState('')
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const [nameError, setNameError] = useState(false)
  const [lastNameErrorText, setLastNameErrorText] = useState('')
  const [lastNameError, setLastNameError] = useState(false)
  const [aliasErrorText, setAliasErrorText] = useState('')
  const [aliasError, setAliasError] = useState(false)
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

  const validatePassword = () => {
    if(!(!!password)) {
      setPasswordErrorText('Password is required')
      setPasswordError(true)
      return false
    }
    if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/.test(password))) {
      setPasswordErrorText('Must have 8 characters, uppercase, number')
      setPasswordError(true)
      return false
    }
    setPasswordErrorText('')
    setPasswordError(false)
    return true
  }

  const validatePasswordConfirmation = useMemo(() => {
    if(password === passwordConfirmation) {
      setPasswordConfirmationError(false)
      setPasswordConfirmationErrorText('')
      return true
    }
    setPasswordConfirmationErrorText('Passwords must match')
    setPasswordConfirmationError(true)
    return false
  }, [password, passwordConfirmation])

  const validateName = () => {
    if(!(!!name)) {
      setNameErrorText('Name is required')
      setNameError(true)
      return false
    }
    setNameErrorText('')
    setNameError(false)
    return true
  }

  const validateLastName = () => {
    if(!(!!lastName)) {
      setLastNameErrorText('Last Name is required')
      setLastNameError(true)
      return false
    }
    setLastNameErrorText('')
    setLastNameError(false)
    return true
  }

  const validateAlias = () => {
    if(!(!!alias)) {
      setAliasErrorText('Alias is required')
      setAliasError(true)
      return false
    }
    if(!(alias.length > 3)) {
      setAliasErrorText('Alias must be at least 4 characters long')
      setAliasError(true)
      return false
    }
    setAliasErrorText('')
    setAliasError(false)
    return true
  }

  const signup = async() => {
    try {
      const valid = validateEmail() && validatePassword() && validatePasswordConfirmation && validateName() && validateLastName() && validateAlias()
      if (!valid) return

      setLoading(true)
      const aliasFoundRes = await apiCall(`/alias/${alias}`, 'GET', false)
      if (aliasFoundRes.aliasFound) {
        setLoading(false)
        dispatch(setToast({toastInfo: {toastMessage: 'Alias already in use', toastColor: 'error'}}))
        return
      }
      const data: registerData = {
        email: email,
        password: password,
        lastname: lastName,
        name: name,
        alias: alias
      }
      const registerRes = await registerUser(data)
      data.uid = registerRes?.uid
      const dbRes = await apiCall('/signup', 'POST', false, data)
      const toStore: toStoreData = {
        token: registerRes?.token,
        imageUrl: dbRes.imageUrl,
        expire: registerRes?.expirationTime,
        email: dbRes.email,
        alias: dbRes.alias
      }
      setLoading(false)
      storeData(toStore)
      // // router.push('/')
    } catch (error) {
      setLoading(false)
      dispatch(setToast({toastInfo: {toastMessage: error as string, toastColor: 'error'}}))
    }
  }

  return (
    <div>
      <TextField fullWidth error={emailError} className='email-field' label="Email" variant="outlined" helperText={emailErrorText || ' '} value={email} onChange={(e) => {
          setEmail(e.target.value);
          validateEmail();
      }}/>
      <TextField fullWidth type='password' error={passwordError} label="Password" variant="outlined" helperText={passwordErrorText || ' '} value={password} onChange={(e) => {
          setPassword(e.target.value);
          validatePassword();
      }}/>
      <TextField fullWidth type='password' error={passwordConfirmationError} label="Password Confirmation" variant="outlined" helperText={passwordConfirmationErrorText || ' '} value={passwordConfirmation} onChange={(e) => {
          setPasswordConfirmation(e.target.value);
      }}/>
      <TextField fullWidth error={nameError} label="Name" variant="outlined" helperText={ nameErrorText ||`${name.length}/20`} value={name} onChange={(e) => {
          setName(e.target.value);
          validateName();
        }}
        inputProps={{
          maxLength: 20
      }}/>
      <TextField fullWidth error={lastNameError} label="Last Name" variant="outlined" helperText={ lastNameErrorText ||`${lastName.length}/20`} value={lastName} onChange={(e) => {
          setLastName(e.target.value);
          validateLastName();
        }}
        inputProps={{
          maxLength: 20
      }}/>
      <TextField fullWidth error={aliasError} label="Alias/Pen Name" variant="outlined" helperText={ aliasErrorText ||`${alias.length}/25`} value={alias} onChange={(e) => {
          setAlias(e.target.value);
          validateAlias();
        }}
        inputProps={{
          maxLength: 25
      }}/>
      <LoadingButton fullWidth variant="contained" className='signup-button' onClick={() => signup()} loading={loading}>Sign Up</LoadingButton>
    </div>
  )
}