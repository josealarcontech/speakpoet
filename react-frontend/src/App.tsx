import { Routes, Route, useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import { Snackbar, Alert, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAppSelector, useAppDispatch } from "./hooks";
import './App.css'
import { clearToast } from "./features/toast/toastSlice";
import spLogo from './assets/spLogo.svg'
import PrivateRoutes from './utils/privateRoutes'
import Home from './routes/home';
import LoginView from './views/loginView/LoginView';
import { signOutUser } from './utils/firebase';
import { clearToken } from './features/token/tokenSlice';
import { clearUser } from './features/user/userSlice';

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const closeSnackbar = () => {
    dispatch(clearToast())
  }
  const logout = async() => {
    handleClose()
    await signOutUser()
    dispatch(clearToken())
    dispatch(clearUser())
    navigate('/login')
  }
  const handleClose = () => {
    setAnchorEl(null);
  }
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const isProtectedLocation = () => {
    const location = useLocation()
    return !location.pathname.includes('/login')
  }

  return (
    <div className="App">
      {isProtectedLocation() ? (
        <AppBar position="static" sx={{backgroundColor: '#ffffff'}}>
          <Toolbar>
            <img src={spLogo} alt="SpeakPoet Logo" width="150" height="50" style={{objectFit: 'cover'}}/>
            <div style={{flexGrow: 1}}/>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      ) : null }
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home/>} path="/"/>
        </Route>
        <Route element={<LoginView/>} path="/login"/>
      </Routes>
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
