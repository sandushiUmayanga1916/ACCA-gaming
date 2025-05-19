import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ConfigContext } from '../../Context/ConfigContext'
import { AuthContext } from '../../Context/AuthContext'
import { encode } from '../../Helpers/EncodeDecode'
import { Alert } from 'react-bootstrap'
import Footer from '../../Components/Footer'

const Register = (props) => {
    const config = useContext(ConfigContext);
    const {setAuthUser} = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [btnText, setBtnText] = useState('Register');
    const [message, setMessage] = useState(null);
	const [errors, setErrors] = useState([]);

	const nameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
	const passwordConfirmationInput = useRef();
	const genderInput = useRef();
	const ageInput = useRef();
	const schoolInput = useRef();
	const gradeInput = useRef();
	const phoneInput = useRef();

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
        nameInput.current.focus();
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();

        setLoading(true)
        setMessage(null)
        setBtnText('Registering...')
        setErrors([])

        const name = nameInput.current.value;
		const email = emailInput.current.value;
        const password = passwordInput.current.value;
		const password_confirmation = passwordConfirmationInput.current.value;
		const gender = genderInput.current.value;
		const age = ageInput.current.value;
		const school = schoolInput.current.value;
		const grade = gradeInput.current.value;
		const phone = phoneInput.current.value;
        
        // Log the API URL for debugging
        console.log('Registering with API URL:', config.api_url + 'auth/register');

        try {
            fetch(config.api_url + 'auth/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 	'name=' + encodeURIComponent(name) +
                        '&email=' + encodeURIComponent(email) +
                        '&password=' + encodeURIComponent(password) +
                        '&password_confirmation=' + encodeURIComponent(password_confirmation) +
                        '&gender=' + encodeURIComponent(gender) +
                        '&age=' + encodeURIComponent(age) +
                        '&school=' + encodeURIComponent(school) +
                        '&grade=' + encodeURIComponent(grade) +
                        '&phone=' + encodeURIComponent(phone)
            })
            .then(res => {
                console.log('Registration response status:', res.status);
                return res.json();
            })
            .then((result) => {
                setLoading(false)
                setBtnText('Register')
                
                console.log('Registration response:', result);
                
                if (result.status === 'success') {
                    delete result.status;
                    let session = result
                    session.isAuth = true;
                    setAuthUser(session)

                    const storeSession = {...session};
                    delete storeSession.isAuth;
                    
                    localStorage.setItem('cauth', encode(JSON.stringify(storeSession)));
                    localStorage.setItem('user', btoa(email));
                } else if (result.hasOwnProperty('errors')) {
                    setErrors(result.errors);
                    setMessage({
                        'type': 'danger',
                        'text': 'Please correct the errors below.'
                    });
                } else {
                    setMessage({
                        'type': 'danger',
                        'text': result.error || 'Registration failed. Please try again.'
                    });
                }
            })
            .catch((error) => {
                console.error('Registration fetch error:', error);
                setLoading(false)
                setBtnText('Register')
                setMessage({
                    'type': 'danger',
                    'text': 'Request failed. Error: ' + error.message
                });
            });
        } catch (error) {
            console.error('Registration error:', error);
            setLoading(false)
            setBtnText('Register')
            setMessage({
                'type': 'danger',
                'text': 'Request failed. Error: ' + error.message
            });
        }
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
					<main className="main-wrapper text-center">
						<h2 className="mb-2">Register User</h2>
						<p className="mb-4">Please fill in your details to register</p>
						
						<MessageAlert/>

						<form className="form-signin" onSubmit={ submitHandler }>
							<div className="row">
								<div className="col-lg-6">
									<div className="mb-4">
										<input type="text" ref={nameInput} className={ (errors['name']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Your name" autoComplete="name" required />
										{ (errors['name']) ? <div className="invalid-feedback">{errors['name']}</div> : '' }

									</div>
									<div className="mb-4">
										<input type="email" ref={emailInput} className={ (errors['email']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Email address" autoComplete="email" required />
										{ (errors['email']) ? <div className="invalid-feedback">{errors['email']}</div> : '' }
									</div>
									<div className="mb-4">
										<input type="password" ref={passwordInput} className={ (errors['password']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Password" autoComplete="new-password" required />
										{ (errors['password']) ? <div className="invalid-feedback">{errors['password']}</div> : '' }
									</div>
									<div className="mb-4">
										<input type="password" ref={passwordConfirmationInput} className={ (errors['password_confirmation']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Confirm Password" autoComplete="new-password" required />
										{ (errors['password_confirmation']) ? <div className="invalid-feedback">{errors['password_confirmation']}</div> : '' }
									</div>
									
								</div>
								<div className="col-lg-6">
									<div className="mb-4">
										<input type="text" ref={phoneInput} className={ (errors['phone']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="WhatsApp Number" autoComplete="tel" required />
										{ (errors['phone']) ? <div className="invalid-feedback">{errors['phone']}</div> : '' }
									</div>
									<div className="row">
										<div className="col-lg-6">
											<div className="mb-4">
												<select ref={genderInput} className={ (errors['gender']) ? 'form-select form-select-lg is-invalid' : 'form-select form-select-lg' } defaultValue="">
													<option value="">Gender</option>
													<option value="male">Male</option>
													<option value="female">Female</option>
													<option value="other">Other</option>
												</select>
												{ (errors['gender']) ? <div className="invalid-feedback">{errors['gender']}</div> : '' }
											</div>
										</div>
										<div className="col-lg-6">
											<div className="mb-4">
												<input type="number" ref={ageInput} className={ (errors['age']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Age" autoComplete="age" min={10} required />
												{ (errors['age']) ? <div className="invalid-feedback">{errors['age']}</div> : '' }
											</div>
										</div>
									</div>
									<div className="mb-4">
										<input type="text" ref={schoolInput} className={ (errors['school']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="School / Institute Name" autoComplete="school" required />
										{ (errors['school']) ? <div className="invalid-feedback">{errors['school']}</div> : '' }
									</div>
									<div className="mb-4">
										<input type="text" ref={gradeInput} className={ (errors['grade']) ? 'form-control form-control-lg is-invalid' : 'form-control form-control-lg' } placeholder="Grade" autoComplete="grade" required />
										{ (errors['grade']) ? <div className="invalid-feedback">{errors['grade']}</div> : '' }
									</div>
								</div>
							</div>

							<button className="btn btn-primary btn-lg btn-submit" disabled={isLoading} type="submit">
                                {!isLoading ? btnText : (
                                    <><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> {btnText}</>
                                )}
                            </button>

							<p className="mt-3 mb-0">Already have an account? <Link to="/login"> Login </Link></p>
						</form>
					</main>
					<Footer/>
				</div>
			</div>
        </div>
    )
}

export default Register