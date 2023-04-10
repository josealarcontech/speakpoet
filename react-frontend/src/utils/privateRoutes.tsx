import { Outlet, useNavigate } from 'react-router-dom'
import { getCurrentUser } from './firebase'
import { useEffect } from 'react'
import store from '../store'
const PrivateRoutes = () => {
  let navigate = useNavigate();
  const isAuthorized = async() => {
    const authToken = store.getState().token.token
    const currUserResp = await getCurrentUser()
    if(currUserResp || authToken){
      return true
    }
    return false
  }
  useEffect(() => {
    const auth = isAuthorized()
    if(!auth) {
      navigate('/login')
    }
  }, [])
  return (
    <Outlet/>
  )
}

export default PrivateRoutes