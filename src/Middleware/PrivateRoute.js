import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import { AuthContext } from '../Context/AuthContext'

const PrivateRoute = ({ children }) => {
    const {authUser} = useContext(AuthContext);
	return (authUser.isAuth === true) ? children : <Navigate to='/login' />
}

export default PrivateRoute
