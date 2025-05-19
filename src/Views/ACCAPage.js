import React, { useEffect, useContext } from 'react'
import { Navigate } from "react-router-dom";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'

const ACCAPage = (props) => {
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

					<Header title={props.title} back={ '/leaderboard' } />

					<main className="main-wrapper">

						<h2 className="mb-4">One more Stop!</h2>

						<p>Congratulations on completing the quiz!</p>

						<p>Embark on your academic journey with us and become one of the most sought-after finance professionals in the world. With over a 100 years of experience in producing financial professionals, we know what you need to be equipped with in order to become the best in the field of finance. </p>
					</main>

					<div className="bottom-action text-center">
						<a className="btn btn-primary btn-lg mt-5 w500px" href="https://www.accaglobal.com/" target='_blank' rel="noreferrer"> Learn more about ACCA </a>
					</div>

					<Footer/>
					
				</div>
			</div>
        </div>
    )
}

export default ACCAPage
