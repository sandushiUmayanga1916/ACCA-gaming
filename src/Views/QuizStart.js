import React, { useState, useEffect, useContext } from 'react'
import { Navigate } from "react-router-dom";
import LoadingSpinner from '../Components/LoadingSpinner';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { AuthContext } from '../Context/AuthContext'
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'
import { encode } from '../Helpers/EncodeDecode'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const QuizStart = (props) => {
    const config = useContext(ConfigContext);
	const {authUser} = useContext(AuthContext);
	const {quizSession, setQuizSession, lastQuestionNo, setLastQuestionNo, clearQuizSession} = useContext(QuizContext);
	const [isLoading, setLoading] = useState(false);
	const [isQuizAvailabe, setQuizAvailabe] = useState(null);
	const swAlert = withReactContent(Swal)

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name

		if (isLoading === false) {
			checkQuizAvailability()
		}
    }, [])

	const checkQuizAvailability = (callback = null) => {
        setLoading(true)

        fetch(config.api_url + 'quiz/check', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + authUser.access_token
            },
        })
        .then(res => res.json())
        .then((result) => {
            setLoading(false)
			
            if (result.status === 'success') {
				setQuizAvailabe(result.quiz_check)
            } else {
				swAlert.fire(
					'Quiz Error',
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

	const startQuizHandler = (e) => {
        e.preventDefault();

        setLoading(true)
		clearQuizSession()

        fetch(config.api_url + 'quiz/start', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Authorization' : 'Bearer ' + authUser.access_token
            }
        })
        .then(res => res.json())
        .then((result) => {
            setLoading(false)
            if (result.status === 'success') {
                delete result.status;
                let session = result
                session.is_started = true;
				session.is_completed = false;
                setQuizSession(session)
				setLastQuestionNo(session.start_question)

                const storeSession = {...session};
                
                localStorage.setItem('quiz_session', encode(JSON.stringify(storeSession)));
            } else {
				swAlert.fire(
					'Error',
					result.error
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

	if (quizSession.is_started === true  && quizSession.is_completed === false) {
		return (
			<Navigate to={ '/quiz/question/' + lastQuestionNo } />
		)
	} else if (quizSession.is_completed === true) {
		return (
			<Navigate to={ '/quiz/finished/' } />
		)
	}

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">

					<Header title={props.title} back={ '/video/unsdg' } />

					<main className="main-wrapper quiz-start d-flex align-items-center justify-content-center">
						<div className="points">
							<div className="instraction-item py-3">
								<p>Participants will only receive one attempt for the quiz.</p>
							</div>
							<div className="instraction-item py-3">
								<p>Don't close the tab or log out.</p>
							</div>
							<div className="instraction-item py-3">
								<p>Second attempts are be blocked.</p>
							</div>
						</div>
					</main>

					{ (!isLoading && isQuizAvailabe != null) ? (
						(isQuizAvailabe) ? (
							<div className="bottom-action text-center">
								<p>Participants can track their progress and check their ranking on the leaderboard.</p>
								<button className="btn btn-primary btn-lg" disabled={isLoading} onClick={ startQuizHandler }> { (!isLoading) ? 'Let the quiz begin!' : (<><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> Starting...</>) } </button>
							</div>
						) : (
							<div className="bottom-action text-center">
								<p>You've already completed the quiz.</p>
								<button className="btn btn-primary btn-lg" disabled='true' onClick={ startQuizHandler }> { (!isLoading) ? 'Let the quiz begin!' : (<><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> Starting...</>) } </button>
							</div>
						) 
					) : (
						<div className="loading-spinner"> 
							<LoadingSpinner/>
							<span>Checking...</span>
						</div>
					) }
					
					<Footer/>
					
				</div>
			</div>
        </div>
    )
}

export default QuizStart
