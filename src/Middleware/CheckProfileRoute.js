import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import { AuthContext } from '../Context/AuthContext'

const CheckProfileRoute = ({ children }) => {
    const {authUser} = useContext(AuthContext);
	return (authUser.profile_completed === true) ? children : <Navigate to='/profile' />
}

export default CheckProfileRoute
