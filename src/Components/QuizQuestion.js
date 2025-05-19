import React, { useState, useEffect, useContext } from 'react'
import { ConfigContext } from '../Context/ConfigContext'
import { AuthContext } from '../Context/AuthContext'
import { QuizContext } from '../Context/QuizContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LoadingSpinner from '../Components/LoadingSpinner';

const QuizQuestion = (props) => {
	const qestion_no = props.data.qestion_no
	const currentQuestionAnswers = props.data.currentQuestionAnswers
	const setCurrentQuestionAnswers = props.data.setCurrentQuestionAnswers

	const swAlert = withReactContent(Swal)
	const config = useContext(ConfigContext);
	const {authUser} = useContext(AuthContext);
	const {quizSession, lastQuestionNo, setLastQuestionNo, quizQuestions, setQuizQuestions, userAnswers, setUserAnswers} = useContext(QuizContext);
	const [isLoading, setLoading] = useState(false);

	let cachedQuestion = (quizQuestions[qestion_no]) ? quizQuestions[qestion_no] : null
	let cachedUserAnswers = (userAnswers[qestion_no]) ? userAnswers[qestion_no] : []

	useEffect(() => {
		cachedQuestion = (quizQuestions[qestion_no]) ? quizQuestions[qestion_no] : null
		cachedUserAnswers = (userAnswers[qestion_no]) ? userAnswers[qestion_no] : []

		setLastQuestionNo(qestion_no)
		setCurrentQuestionAnswers(cachedUserAnswers)

		if (cachedQuestion === null && isLoading === false) {
			fetchQuestion()
		}

	}, [qestion_no])

	const fetchQuestion = async () => {
		setLoading(true)

        fetch(config.api_url + 'quiz/' + quizSession.session_id + '/' + qestion_no, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
				'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + authUser.access_token
            }
        })
        .then(res => {
            return res.json()
        })
        .then((result) => {
			setLoading(false)
            if (result.status === 'success') {
				delete result.status;

				let question_list = {...quizQuestions};
				question_list[result.question_no] = {
					'question_type' : result.question_type,
					'question_text' : result.question_text,
					'question_answers' : result.question_answers
				}

				setQuizQuestions(question_list)
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

	const handleChange = (e) => {
		const question_data = (quizQuestions[qestion_no]) ? quizQuestions[qestion_no] : null
		const value = parseInt(e.target.value);

		if (question_data !== null) {
			let user_answers = [];

			if (question_data.question_type === 'single') {
				user_answers = [value]
			} else {
				const el_index = currentQuestionAnswers.indexOf(value)
				if(el_index !== -1)  {
					user_answers = [...currentQuestionAnswers]
					user_answers.splice(el_index, 1);
				} else {
					user_answers = [value, ...currentQuestionAnswers]
				}
			}

			setCurrentQuestionAnswers(user_answers)

			let newUserAnswers = {...userAnswers}
			newUserAnswers[lastQuestionNo] = user_answers
			setUserAnswers(newUserAnswers)
		}	
	}

	if (cachedQuestion === null) {
		return (
			<div className="loading-spinner"> 
				<LoadingSpinner/>
				<span>Content Loading...</span>
			</div>
		)
	} else {
		return (
			<div className="question text-center">
				<p>{ cachedQuestion.question_text }</p>
				<div className="answers">
					<div className="row g-2 g-lg-5">
						{cachedQuestion.question_answers.map((answer, index) =>
							<div key={ answer.id } className="col-lg-6 d-flex">
								<div className="form-check text-start">
									<input className="form-check-input me-4" type={ (cachedQuestion.question_type === 'single') ? 'radio' : 'checkbox' } name={ (cachedQuestion.question_type === 'single') ? 'answers' : '' } value={ answer.id } id={ 'answer_check_' + answer.id } onChange={handleChange} checked={ (currentQuestionAnswers.indexOf(answer.id) !== -1) ? true : false } />
									<label className="form-check-label" htmlFor={ 'answer_check_' + answer.id }>
										{ answer.answer }
									</label>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}

export default QuizQuestion
