import { useState } from 'react'
import './LoginView.css'
import { Grid, Box, Card, CardContent, Divider, Button } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import LoginForm from '../../components/loginForm/LoginForm'
import SignupForm from '../../components/signupForm/SignupForm'
import {loginTexts} from '../../utils/texts'
import spLogo from './../../assets/spLogo.svg'
import { useAppDispatch } from './../../hooks'
import { setToken, setTokenExpirationDate } from '../../features/token/tokenSlice'
import { setImage, setUserAlias, setUserEmail } from '../../features/user/userSlice'


export interface toStoreData  {
  token?: string
  imageUrl: string
  expire?: string
  email: string
  alias: string
}

function LoginView() {
  const [phase, setPhase] = useState(0)
  const dispatch = useAppDispatch()
  const storeData = (data: toStoreData) => {
    console.log("here")
    console.log(data)
    if(data.token != undefined) {
      dispatch(setToken({token: data.token}))
    }
    if(data.expire != undefined) {
      dispatch(setTokenExpirationDate({tokenExpirationDate: data.expire}))
    }
    dispatch(setImage({profileImage: data.imageUrl}))
    dispatch(setUserAlias({userAlias: data.alias}))
    dispatch(setUserEmail({userEmail: data.email}))
  }

  return (
    <div className='view-height'>
      <Box className='full-height'>
        <Grid container className='full-height'>
          <Grid item xs={6} display="flex" justifyContent="center" alignItems="center">
            <div>
              <img src={spLogo} alt="SpeakPoet Logo" width="400" height="150" style={{objectFit: 'cover'}}/>
              <Carousel swipe={false} interval={8000} animation='slide' navButtonsAlwaysInvisible 
                indicatorContainerProps={{ style: { visibility: 'hidden' }}}>
                { loginTexts().map( (item, i) => <h2 key={i}>{item}</h2> ) }
              </Carousel>
            </div>
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center" alignItems="center">
            <Card variant="outlined" className={phase == 1 ? 'signup-card' : 'login-card'}>
              <CardContent>
                <Carousel swipe={false} animation='slide' navButtonsAlwaysInvisible indicators={false} autoPlay={false} index={phase}>
                  <div>
                    <LoginForm storeData={ storeData }></LoginForm>
                    <Divider className="divider"/>
                    <Button fullWidth variant="contained" className='login-button' onClick={() => setPhase(1)} color="success">Sign Up</Button>
                  </div>
                  <div>
                    <SignupForm storeData={ storeData }></SignupForm>
                    <Divider className="divider"/>
                    <Button fullWidth variant="contained" className='login-button' onClick={() => setPhase(0)} color="success">Have an account? Login</Button>
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default LoginView