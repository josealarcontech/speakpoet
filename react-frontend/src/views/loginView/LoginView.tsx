import { useState } from 'react'
import './LoginView.css'
import { Grid, Box } from '@mui/material'
function LoginView() {
  const [loginPhase, setLoginPhase] = useState(true)
  const [phase, setPhase] = useState('0') //might change

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <div>xs=8</div>
          </Grid>
          <Grid item xs={4}>
            <div>xs=4</div>
          </Grid>
          <Grid item xs={4}>
            <div>xs=4</div>
          </Grid>
          <Grid item xs={8}>
            <div>xs=8</div>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default LoginView