import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import { QuizContext } from '../Context/QuizContext'

const QuizRoute = ({ children }) => {
	const {quizSession} = useContext(QuizContext);

	if (quizSession.is_completed === true) {
		return (<Navigate to="/quiz/finished" />)
	} else if (quizSession.is_started !== true) {
		return (<Navigate to="/quiz/start" />)
	}

	return children
}

export default QuizRoute
