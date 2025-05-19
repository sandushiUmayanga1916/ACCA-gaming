import React, { useEffect, useContext } from 'react'
import { Link, Navigate } from "react-router-dom";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'

const QuizInstructions = (props) => {
    const config = useContext(ConfigContext);
	const {quizSession, lastQuestionNo} = useContext(QuizContext);

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
    }, [])

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

					<Header title={props.title} back={ '/video/presentation' } />

					<main className="main-wrapper quiz-start d-flex align-items-center justify-content-center">
						<div className="points">
							<div className="instraction-item py-3">
								<p>All participants will be required to watch a video based on the United Nations Sustainable Development Goals before the quiz.</p>
							</div>
							<div className="instraction-item py-3">
								<p>Participants will receive 20 multiple choice questions (MCQs) to answer based on the video. </p>
							</div>
							<div className="instraction-item py-3">
								<p>The video can be replayed multiple times before commencing the quiz and cannot be played back once the quiz has begun.</p>
							</div>
							<div className="instraction-item py-3">
								<p>Each participant will receive a total of 30 minutes for the quiz.</p>
							</div>
							<div className="instraction-item py-3">
								<p>Upon completing the quiz, participants can check their score and rank on the leaderboard</p>
							</div>
						</div>
					</main>

					<div className="bottom-action text-center">
						<Link className="btn btn-primary btn-lg mt-5 w500px" to="/video/unsdg"> Proceed to the video </Link>
					</div>

					<Footer/>
					
				</div>
			</div>
        </div>
    )
}

export default QuizInstructions
