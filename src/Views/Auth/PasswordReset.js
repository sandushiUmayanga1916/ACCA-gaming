import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConfigContext } from '../../Context/ConfigContext'
//import { AuthContext } from '.../../Context/AuthContext'
import { Alert } from 'react-bootstrap'
import Intro from '../../Components/Intro'
import Footer from '../../Components/Footer'

const PasswordReset = (props) => {
	let { token } = useParams();
	const queryParams = new URLSearchParams(window.location.search);
	const reset_email = queryParams.get('email');;
    const config = useContext(ConfigContext);
    //const {setAuthUser} = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
	const [errors, setErrors] = useState([]);
    const emailInput = useRef();
    const passwordInput = useRef();
	const passwordConfirmInput = useRef();

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
		if (reset_email != null) {
			emailInput.current.value = reset_email;
			passwordInput.current.focus();
		} else {
			emailInput.current.focus();
		}
		
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();

        setLoading(true)
        setMessage(null)
		setErrors([])

        const email = emailInput.current.value;
        const password = passwordInput.current.value;
		const password_confirm = passwordConfirmInput.current.value;

        fetch(config.api_url + 'auth/password/reset', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body: 'token=' + token + '&email=' + email + '&password=' + password + '&password_confirmation=' + password_confirm
        })
        .then(res => res.json())
        .then((result) => {
            setLoading(false)
            if (result.status === 'success') {
                setMessage({
					'type' : 'success',
					'text' : result.message
				});
			} else if (result.hasOwnProperty('errors')) {
				setErrors(result.errors);
				/* setMessage({
					'type' : 'danger',
					'text' : result.message
				}); */
            } else {
				setMessage({
					'type' : 'danger',
					'text' : result.error
				});
            }
        }, (error) => {
            setLoading(false)
			setMessage({
				'type' : 'danger',
				'text' : 'Request failed. Check back soon.'
			});
            //console.log(error);
        })
    }

	const MessageAlert  = () => {
		if (message !== null) {
            return (
				<Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
					{message.text}
				</Alert>
            )
        }

		return null;
	}

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">
					<main className="main-wrapper">
						<div className="row align-items-center">
							<div className="col-lg-6 order-2 order-lg-1">
								<form className="form-signin" onSubmit={ submitHandler }>

									<h2 className="mb-4">Password Reset</h2>

									<MessageAlert/>

									<div className="mb-4">
										<input type="email" ref={emailInput} className={ (errors['email']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Email address" autoComplete="email" required />
										{ (errors['email']) ? <div className="invalid-feedback">{errors['email']}</div> : '' }
									</div>
									<div className="mb-4">
										<input type="password" ref={passwordInput} className={ (errors['password']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Password" required />
										{ (errors['password']) ? <div className="invalid-feedback">{errors['password']}</div> : '' }
									</div>
									<div className="mb-4">
										<input type="password" ref={passwordConfirmInput} className={ (errors['password_confirmation']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Confirm Password" required />
										{ (errors['password_confirmation']) ? <div className="invalid-feedback">{errors['password_confirmation']}</div> : '' }
									</div>

									<button className="btn btn-primary btn-lg btn-login w-100" disabled={isLoading} type="submit"> { (!isLoading) ? 'Reset Password' : (<><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> Password Resetting...</>) } </button>

									<p className="mt-3">Already have the password? <Link to="/login">Login</Link></p>
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

export default PasswordReset
