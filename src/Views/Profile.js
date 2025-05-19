import React, { useState, useEffect, useContext, useRef } from 'react'
import { Navigate } from "react-router-dom";
import { Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { encode } from '../Helpers/EncodeDecode'
import { ConfigContext } from '../Context/ConfigContext'
import { AuthContext } from '../Context/AuthContext'
import Header from '../Components/Header';
import Footer from '../Components/Footer'

const Profile = (props) => {
    const config = useContext(ConfigContext);
    const {authUser, setAuthUser} = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
	const [userProfile, setUserProfile] = useState(null);
    const [message, setMessage] = useState(null);
	const [errors, setErrors] = useState([]);
	const swAlert = withReactContent(Swal)

	const genderInput = useRef();
	const ageInput = useRef();
	const schoolInput = useRef();
	const gradeInput = useRef();
	const phoneInput = useRef();

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
       
		if (!isLoading && authUser.profile_completed !== true) {
			fetchUserProfile()
		}
    }, [])

	useEffect(() => {
		if (userProfile !== null) { 
			phoneInput.current.value = userProfile.phone
			genderInput.current.value = userProfile.gender
			ageInput.current.value = userProfile.age
			schoolInput.current.value = userProfile.school
			gradeInput.current.value = userProfile.grade

			phoneInput.current.focus(); 
		}
	}, [userProfile])

	const fetchUserProfile = async () => {
		disabledForm(true)

        fetch(config.api_url + 'auth/profile', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
				'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + authUser.access_token
            }
        })
        .then(res => {
			disabledForm(false)
            return res.json()
        })
        .then((result) => {
            if (result.status === 'success') {
				setUserProfile(result.profile)
            } else {
				swAlert.fire(
					'Quiz Error',
					result.message
				)
            }
        }, (error) => {
            swAlert.fire(
				'Oops! Something went wrong',
				'Request failed. Please contact the system administrator.'
			)
        })
	}

    const updateProfileHandler = (e) => {
        e.preventDefault();

        setLoading(true)
        setMessage(null)

		let form_data = {
			'gender' : genderInput.current.value,
			'age' : ageInput.current.value,
			'school' : schoolInput.current.value,
			'grade' : gradeInput.current.value,
			'phone' : phoneInput.current.value,
		}

        fetch(config.api_url + 'auth/profile', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + authUser.access_token,
            },
			body : JSON.stringify(form_data)
        })
        .then(res => res.json())
        .then((result) => {
            setLoading(false)
            if (result.status === 'success') {
				let session = authUser
                session.profile_completed = true;
                setAuthUser(session)

                const storeSession = {...session};
                delete storeSession.isAuth;
                localStorage.setItem('cauth', encode(JSON.stringify(storeSession)));
			} else if (result.hasOwnProperty('errors')) {
				setErrors(result.errors);
            } else {
				swAlert.fire(
					'Profile Update Failure',
					result.message
				)
            }
        }, (error) => {
            setLoading(false)
			swAlert.fire(
				'Oops! Something went wrong',
				'Request failed. Please contact the system administrator.'
			)
        })
    }

	const disabledForm = (status) => {
		phoneInput.current.disabled = status
		genderInput.current.disabled = status
		ageInput.current.disabled = status
		schoolInput.current.disabled = status
		gradeInput.current.disabled = status
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

	if (authUser.profile_completed === true) {
		return (
			<Navigate to={ '/' } />
		)
	}

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">

					<Header title={props.title} />

					<main className="main-wrapper text-center d-flex align-items-center justify-content-center">
						<MessageAlert/>
							
						<form className="form-signin w-100" onSubmit={ updateProfileHandler }>
							<p className="mb-4">Please fill in your details to continue</p>


							<div className="row justify-content-center">
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

							<button className="btn btn-primary btn-lg btn-login w-25" disabled={isLoading} type="submit"> { (!isLoading) ? 'Update' : (<><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> Updating...</>) }</button>
							
						</form>
						
					</main>

					<Footer/>
					
				</div>
			</div>
        </div>
    )
}

export default Profile
