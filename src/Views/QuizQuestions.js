import React, { useState, useEffect, useContext } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import QuizQuestion from '../Components/QuizQuestion';
import QuizNavigator from '../Components/QuizNavigator';
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'

const QuizQuestions = (props) => {
	let { qestion_no } = useParams();
	qestion_no = parseInt(qestion_no);

    const config = useContext(ConfigContext);
	const {quizSession, userAnswers} = useContext(QuizContext);

	let cachedUserAnswers = (userAnswers[qestion_no]) ? userAnswers[qestion_no] : []
	const [currentQuestionAnswers, setCurrentQuestionAnswers] = useState(cachedUserAnswers);

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
    }, [])

	if (quizSession.is_completed) {
		return (
			<Navigate to={'/quiz/finished'} />
		)
	}

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">

					<Header title={quizSession.quiz_size + ' ' + props.title} />
					
					<main className="main-wrapper d-flex align-items-center quiz-question">
						<div className="w-100">
							<h2 className="text-center">Quiz Question { qestion_no } / {quizSession.quiz_size}</h2>
							<QuizQuestion data={{qestion_no, currentQuestionAnswers, setCurrentQuestionAnswers}}/>
						</div>
					</main>

					<QuizNavigator data={{qestion_no, setCurrentQuestionAnswers}}/>

					<Footer/>
				</div>
			</div>
        </div>
    )
}

export default QuizQuestions
