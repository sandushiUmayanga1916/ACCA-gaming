import React, { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import LoadingSpinner from '../Components/LoadingSpinner';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { AuthContext } from '../Context/AuthContext'
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const QuizFinished = (props) => {
    const config = useContext(ConfigContext);
	const {authUser} = useContext(AuthContext);
	const {quizSession, quizResult, setQuizResult, finishedQuizSession, showReadableTime} = useContext(QuizContext);
	const [isLoading, setLoading] = useState(false);
	const swAlert = withReactContent(Swal)

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name

		if (isLoading === false && quizSession.is_started === true && quizSession.is_completed !== true) {
			endQuizSession()
		}
    }, [])

	const endQuizSession = (callback = null) => {
        setLoading(true)

		let form_data = {
			'session_id' : quizSession.session_id
		}

        fetch(config.api_url + 'quiz/end', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + authUser.access_token
            },
			body : JSON.stringify(form_data)
        })
        .then(res => res.json())
        .then((result) => {
            setLoading(false)
			
            if (result.status === 'success') {
				setQuizResult({quiz_score : result.quiz_score, quiz_time: result.quiz_time})
				finishedQuizSession()
				if (callback !== null) {
					callback()
				}
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

	if (quizSession.is_started === false ) { // && quizSession.is_completed !== true
		return (
			<Navigate to={'/quiz/start'} />
		)
	}

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">

					<Header title={props.title} />
					
					<main className="main-wrapper quiz-finished d-flex align-items-center justify-content-center">
						<div>
							<div className="congrats text-center">
								<h1 className="mb-4">Congratulations</h1>
								<p>Congratulations on successfully completing the quiz! Keep working hard and believing in yourself. More amazing achievements are yet to come. Join ACCA to broaden your horizons and kickstart your career in the right direction.</p>

								{ (!isLoading && quizResult) ? (
									<div className="result">
										<div><span className="score">Your Score : <strong>{quizResult.quiz_score} / {quizSession.quiz_size}</strong></span></div>
										<div>Time : <strong>{showReadableTime(quizResult.quiz_time)}</strong></div>
									</div>
								) : (
									<div className="loading-spinner"> 
										<LoadingSpinner/>
										<span>Content Loading...</span>
									</div>
								) }

							</div>
							
						</div>
					</main>

					<div className="bottom-action text-center">
						<Link className="btn btn-primary btn-lg btn-view-scoreboard" disabled={isLoading} to={'/leaderboard'}> { (!isLoading) ? 'View the Leaderboard' : (<><span className="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span> Quiz Finishing...</>) } </Link>
					</div>

					<Footer/>
				</div>
			</div>
        </div>
    )
}

export default QuizFinished
