import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { ConfigContext } from '../Context/ConfigContext'
import { AuthContext } from '../Context/AuthContext'
import { QuizContext } from '../Context/QuizContext'
import { useGoogleLogout } from 'react-google-login'

import BackIcon from '../_images/back.svg'
import NextIcon from '../_images/next.svg'
import ClockIcon from '../_images/clock.svg'

const Header = (props) => {
    const config = useContext(ConfigContext);
	const navigate = useNavigate();
    const {authUser, logoutUser} = useContext(AuthContext);
	const {quizSession, clearQuizSession} = useContext(QuizContext);
	const [title] = useState(props.title);

	const countdownTimer =  (expire_time) => {
		var distance = expire_time;

		var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
		var minutes = Math.floor((distance % (60 * 60)) / (60));
		var seconds = Math.floor((distance % (60)) );

		// If the count down is finished, write some text
		if (distance < 0) {
			return "End";
		}

		let output = '';

		if (hours > 0) output = hours + "h ";

		output += minutes + "m " + seconds + "s ";

		return output;
	}

	const endTime = (quizSession.session_end && quizSession.is_started === true && quizSession.is_completed !== true) ? parseInt(quizSession.session_end) : 0;
	const timestamp = Math.floor(Date.now() / 1000)
	const [expires, setExpires] = useState((endTime > 0) ? endTime - timestamp : 0);
	const [timer, setTimer] = useState(countdownTimer(endTime - timestamp));

	const { signOut } = useGoogleLogout({
		clientId : config.google.client_id,
		cookiePolicy : 'single_host_origin',
		onLogoutSuccess : (res) => {
			
		}
	})

	useEffect(() => {
		let interval = null

		if (quizSession.is_started === true && quizSession.is_completed !== true) {
			if (expires > 0) {
				interval = setInterval(() => {
					const timestamp = Math.floor(Date.now() / 1000)
					const defferance = endTime - timestamp
					setExpires(defferance);
				}, 1000);
		
				if (quizSession.is_completed === true || authUser.isAuth === false) {
					clearTimeout(interval)
					setExpires(0)
					//finishedQuizSession()
				}

				setTimer(countdownTimer(expires))
			} else {
				clearTimeout(interval)
				setExpires(0)
				//finishedQuizSession()
				navigate('/quiz/finished')
			}
		}

		return () => {
			if(interval !== null) {
				clearInterval(interval)
			}
		}
	}, [expires]);

    const handleLogout = (e) => {
		e.preventDefault();

		logoutUser().then(() => {
			if (authUser.provider === 'google') {
				signOut()
			}
			clearQuizSession()
		})
	}

	const BackButton = () => {
		if (props.back) {
			return (
				<Link className="nav-link back" to={ props.back }> <img src={ BackIcon } alt="Back" /> </Link>
			)
		}
	}

	const NextButton = () => {
		if (props.next) {
			return (
				<Link className="nav-link nect" to={ props.next }> <img src={ NextIcon } alt="Next" /> </Link>
			)
		}
	}

    return (
        <header className="header">
			<div className="row align-items-center">
				<div className="col-lg-4 order-1">
					<h2>{ title }</h2> 
				</div>
				<div className="col-lg-4 order-3 order-lg-2 text-center">
					{ (quizSession.is_started === true && quizSession.is_completed === false && expires > 0) ? (
						<h4 className="d-flex align-items-center justify-content-center mt-3 mt-lg-0"><img className="me-3" src={ ClockIcon } alt="clock" width="26" height="26" />{ timer }</h4>
					) : '' }
				</div>
				<div className="col-lg-4 order-2 order-lg-3 mt-3 mt-lg-0 d-flex">
					<Nav className="right-menu mx-auto ms-lg-auto me-lg-0 align-items-center">
						<BackButton />
						<NextButton />
						<span className="user-name">Hi, {authUser.user_name.split(' ')[0]}</span>
						<a className="nav-link" href="#logout" onClick={ handleLogout }>Logout</a>
					</Nav>
				</div>
			</div>
        </header>
    )
}

export default Header