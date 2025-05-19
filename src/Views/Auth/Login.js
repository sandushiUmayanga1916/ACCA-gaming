import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ConfigContext } from '../../Context/ConfigContext'
import { AuthContext } from '../../Context/AuthContext'
import { encode } from '../../Helpers/EncodeDecode'
import { Alert } from 'react-bootstrap'
import Intro from '../../Components/Intro'
import Footer from '../../Components/Footer'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LoadingSpinner from '../../Components/LoadingSpinner';

const Login = (props) => {
    const config = useContext(ConfigContext);
    const {setAuthUser} = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const emailInput = useRef();
    const passwordInput = useRef();
	const swAlert = withReactContent(Swal)
	const [isLoadingSocial, setLoadingSocial] = useState(false);
	const [loadingText, setLoadingText] = useState('User Authenticating...');

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name

        if (localStorage.getItem('user')) {
            emailInput.current.value = atob(localStorage.getItem('user'))
            passwordInput.current.focus();
        } else {
            emailInput.current.focus();
        }

		gapi.load('client:auth2', () => {
			gapi.client.init({
				clientId : config.google.client_id,
				score : ""
			});
		});

    }, [])

    const submitHandler = (e) => {
        e.preventDefault();

        setLoading(true)
        setMessage(null)

        const email = emailInput.current.value;
        const password = passwordInput.current.value;

        // Using try/catch and logging any errors to help debug
        try {
            console.log('Attempting login to:', config.api_url + 'auth/login');
            
            fetch(config.api_url + 'auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
            })
            .then(res => {
                console.log('Login response status:', res.status);
                return res.json();
            })
            .then((result) => {
                setLoading(false)
                console.log('Login response:', result);
                
                if (result.status === 'success') {
                    delete result.status;
                    let session = result
                    session.isAuth = true;
                    setAuthUser(session)

                    const storeSession = {...session};
                    delete storeSession.isAuth;
                    
                    localStorage.setItem('cauth', encode(JSON.stringify(storeSession)));
                    localStorage.setItem('user', btoa(email));
                } else {
                    //setMessage(result.error);
                    setMessage('Invalid Credentials');
                    
                }
            })
            .catch((error) => {
                console.error('Login fetch error:', error);
                setLoading(false)
                setMessage('Request failed. Check back soon. Error: ' + error.message);
            });
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false)
            setMessage('Request failed. Check back soon. Error: ' + error.message);
        }
    }

	const MessageAlert  = () => {
		if (message !== null) {
            return (
				<Alert variant="danger" onClose={() => setMessage(null)} dismissible>
					{message}
				</Alert>
            )
        }

		return null;
	}

	const getGoogleUserInfo = (access_token) => {
		let gender = null
		let age = null

		setLoadingSocial(true)
		setLoadingText('User Info Checking...')

		return fetch('https://people.googleapis.com/v1/people/me?personFields=birthdays,genders', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + access_token
            }
        })
        .then(res => res.json())
        .then((result) => {
            if (result.genders) {
				gender = result.genders[0].value ?? null
			} 
			if (result.birthdays) {
				const year = result.birthdays[1].date.year ?? null

				if (year !== null) {
					age = parseInt(new Date().getFullYear()) - year
				}
			}
			return {gender, age}
        }, (error) => {
			return {gender, age}
        })
	}

	const userAuthenticate = (user_info) => {
		setLoadingSocial(true)
		setLoadingText('User Authenticating...')

		let form_data = {
			'provider' : 'google',
			'provider_id' : user_info.googleId,
			'email' : user_info.email,
			'gender' : user_info.gender,
			'age' : user_info.age,
			'info' : user_info,
		}

        fetch(config.api_url + 'auth/social/login', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/json',
            },
			body : JSON.stringify(form_data)
        })
        .then(res => res.json())
        .then((result) => {
			setLoadingSocial(false)
            if (result.status === 'success') {
                delete result.status;
                let session = result
                session.isAuth = true;
                setAuthUser(session)

                const storeSession = {...session};
                delete storeSession.isAuth;
                
                localStorage.setItem('cauth', encode(JSON.stringify(storeSession)));
			} else if (result.error === 'email') {
				swAlert.fire(
					'Already Registered',
					result.message
				)
            } else {
				swAlert.fire(
					'Social Login Error',
					'Please contact the system administrator.'
				)
            }
        }, (error) => {
			setLoadingSocial(false)
			swAlert.fire(
				'Oops! Something went wrong',
				'Request failed. Please contact the system administrator.'
			)
        })
	}

	const onSuccess = (res) => {
		const accessToken = gapi.auth.getToken().access_token
		let profile = res.profileObj;

		getGoogleUserInfo(accessToken).then((res) => {
			profile['gender'] = res.gender
			profile['age'] = res.age

			userAuthenticate(profile)
		})
	}

	const SocialLoginLoader  = () => {
        if (isLoadingSocial) {
            return (
                <div className="social-login-loading"> 
                    <LoadingSpinner/>
                    <span>{loadingText}</span>
                </div>
            )
        }
        
        return null;
	}

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">
					<main className="main-wrapper">
						<SocialLoginLoader/>
						<div className="row align-items-center">
							<div className="col-lg-6 order-2 order-lg-1">
								<form className="form-signin" onSubmit={ submitHandler }>

									<h2 className="mb-4">Login to Your Account</h2>

									<MessageAlert/>

									<div className="mb-4">
										<input type="email" ref={emailInput} className="form-control form-control-lg" placeholder="Email address" autoComplete="email" required />
									</div>
									
									<div className="mb-4">
										<input type="password" ref={passwordInput} className="form-control form-control-lg" placeholder="Password" required />
									</div>

									<button className="btn btn-primary btn-lg btn-login w-100" disabled={isLoading} type="submit"> { (!isLoading) ? 'Login' : (<><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> Login...</>) } </button>

									<p className="mt-3 mb-0"><Link className="item" to="/password/forgot"> Forgot Your Password? </Link></p>

									<p className="mt-3 mb-0">Don't have an account?</p>

									<div className="mt-4">
										<Link className="btn btn-secondary btn-register" to="/register"> Register </Link><span className="d-inline-block my-2 mx-lg-3">OR</span>
										<GoogleLogin
											clientId={config.google.client_id}
											onSuccess={onSuccess}
											cookiePolicy={'single_host_origin'}
											disabled={isLoadingSocial}
											className="btn-signin-google"
											/* isSignedIn={true} */
											scope="profile email https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.birthday.read"
											theme="light"
										/>
									</div>
								</form>
							</div>
							<div className="col-lg-6 order-1 order-lg-2">
								<Intro/>
							</div>
						</div>
					</main>
					<Footer/>
				</div>
			</div>
        </div>
    )
}

export default Login