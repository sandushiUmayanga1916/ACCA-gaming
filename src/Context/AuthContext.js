import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { ConfigContext } from '../Context/ConfigContext'
import { encode, decode } from '../Helpers/EncodeDecode'

export const AuthContext = createContext()

export const AuthProvider = props => {
    const config = useContext(ConfigContext);
    const [checkLocalStorage, setCheckLocalStorage] = useState(false);
    const [authUser, setAuthUser] = useState({ isAuth : false });
    const [isLoading, setLoading] = useState(false);
    
    const getLoalStorageSession = () => {
        try {
            const sessionJSON = localStorage.getItem("cauth");
            if (sessionJSON) {
                return JSON.parse(decode(sessionJSON));
            }
        } catch(err) {
            return false;
        }
        return false;
    }

    const getTokenExpiresTime = (session) => {
        try {
            const sessPArts = session.access_token.split('.')
            const payload = (sessPArts[1]) ? JSON.parse(atob(sessPArts[1])) : {}
            const timestamp = Math.floor(Date.now() / 1000)
            return (payload.exp - timestamp)
        } catch(err) {
            return 0;
        }
    }

	const logoutUser = async () => {
        return fetch(config.api_url + 'auth/logout', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
				'Accept' : 'application/json',
                'Authorization' : 'Bearer ' + authUser.access_token
            }
        })
        .then(res => res.json())
        .then((result) => {
            logoutSession()
        }, (error) => {
			logoutSession()
            console.log(error);
        })
    }

    const logoutSession = () => {
        localStorage.removeItem('cauth');
		localStorage.removeItem('quiz_session');
        setAuthUser({ isAuth : false })
    }

    const checkLoalStorageToken = () => {
       
        try {
            if (checkLocalStorage === false && authUser.isAuth === false) {
                setCheckLocalStorage(true)
                const session = getLoalStorageSession();

                if (session !== false) {
                    const expires = getTokenExpiresTime(session)
        
                    if (expires <= 0) {
                        logoutSession()
                        setLoading(false)
                    } else {
                        const timePeriod = (expires - 60);
                       
                        if (timePeriod <= 0 && localStorage.getItem("app_status") !== 'TOKEN_REFRESHING' ) { //!isLoading
                            setLoading(true)
                            refreshTokens(session)
                        } else {
                            session.isAuth = true;
                            setAuthUser(session)
                            setLoading(false)
                        }
                    }
                    //console.log('Token expires in :', expires);
                }
            }
        } catch(err) {
            logoutSession()
        }
       
    }

    const refreshTokens = useCallback(async (session) => {
        localStorage.setItem('app_status', 'TOKEN_REFRESHING');
        fetch(config.api_url + 'auth/refresh', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
				'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer ' + session.access_token
            },
            body: 'refresh_token=' + session.refresh_token
        })
        .then(res => {
            if (res.status !== 200 ) {
                logoutSession()
                setLoading(false)
            }
            return res.json()
        })
        .then((result) => {
            if (result.status === 'success') {
                delete result.status;
                let session = result
                session.isAuth = true;
                setAuthUser(session)

                const storeSession = {...session};
                delete storeSession.isAuth;
                localStorage.setItem('cauth', encode(JSON.stringify(storeSession)));
                setLoading(false)
                localStorage.removeItem('app_status');
            }
        }, (error) => {
            console.log(error);
            logoutSession()
            setLoading(false)
        })
    }, [config])

    checkLoalStorageToken()

    useEffect(() => {
		
        if ( authUser.isAuth === true) {
            const session = getLoalStorageSession();
           
            if (session !== false) {
                const expires = getTokenExpiresTime(session)

                if (expires > 0) {
                    const timePeriod = (expires - 60) * 1000;
					
                    const timer = setTimeout(() => { 
                        refreshTokens(session)
                        clearTimeout(timer);
                    }, timePeriod);
                }
            }
        }
    }, [authUser, refreshTokens])

    if (isLoading) {
        return null
        //return <div className="loading-authenticate"><span>Authenticating....</span></div>
    }

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, logoutUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}
