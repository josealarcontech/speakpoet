import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import * as React from 'react';
import { Snackbar, Alert, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAppSelector, useAppDispatch } from "./hooks";
import router from './router'
import './App.css'
import { clearToast } from "./features/toast/toastSlice";
import spLogo from './assets/spLogo.svg'
import PrivateRoutes from './utils/privateRoutes'
import HomeView from './views/homeView/HomeView';
import LoginView from './views/loginView/LoginView';

function App() {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const closeSnackbar = () => {
    dispatch(clearToast())
  }
  return (
    <div className="App">
      <AppBar position="static" sx={{backgroundColor: '#ffffff'}}>
        <Toolbar>
          <img src={spLogo} alt="SpeakPoet Logo" width="150" height="50" style={{objectFit: 'cover'}}/>
          <div style={{flexGrow: 1}}></div>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
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
                
              >
                <MenuItem >Profile</MenuItem>
                <MenuItem >My account</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<HomeView/>} path="/"/>
          </Route>
          <Route element={<LoginView/>} path="/login"/>
        </Routes>
      </Router>
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
