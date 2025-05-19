import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import { AuthContext } from '../Context/AuthContext'

const LoginRoute = ({ children }) => {
    const {authUser} = useContext(AuthContext);
    return (authUser.isAuth === false) ? children : <Navigate to='/video/presentation' />
}

export default LoginRoute
