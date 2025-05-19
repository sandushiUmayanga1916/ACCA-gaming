import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfigContext } from '../Context/ConfigContext'
import { AuthContext } from '../Context/AuthContext'
import { QuizContext } from '../Context/QuizContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import BackIcon from '../_images/back.svg'
import NextIcon from '../_images/next.svg'

const QuizNavigator = (props) => {

	const qestion_no = props.data.qestion_no
	const setCurrentQuestionAnswers = props.data.setCurrentQuestionAnswers

	const navigate = useNavigate();
	const swAlert = withReactContent(Swal)
	const config = useContext(ConfigContext);
	const {authUser} = useContext(AuthContext);
	const {quizSession, quizQuestions, userAnswers} = useContext(QuizContext);

	const updateAnswerHandler = async (q_no, callback) => {
        //setLoading(true)

		let getQuestion = (quizQuestions[q_no]) ? quizQuestions[q_no] : null
		let getQuestionAnswers = (userAnswers[q_no]) ? userAnswers[q_no] : []

		if (getQuestionAnswers.length <= 0) {
			//setLoading(false)
			swAlert.fire(
				'Answer Required',
				'Please choose an answer to continue'
			)
			return true;
		}

		let form_data = {
			'question_type' : (getQuestion !== null) ? getQuestion.question_type : '',
			'answer_id' : getQuestionAnswers
		}

		fetch(config.api_url + 'quiz/' + quizSession.session_id + '/' + q_no, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + authUser.access_token,
            },
			body : JSON.stringify(form_data)
        })
        .then(res => res.json())
        .then((result) => {
            //setLoading(false)
            if (result.status === 'success') {
				callback()
            } else {
				swAlert.fire(
					'Quiz Error',
					result.message
				)
            }
        }, (error) => {
            //setLoading(false)
			swAlert.fire(
				'Oops! Something went wrong',
				'Request failed. Please contact the system administrator.'
			)
        })
    }

	const handleNextButton = (e) => {
		e.preventDefault();
		const next = qestion_no + 1
		let next_link = '/quiz/question/' + next

		if (next > parseInt(quizSession.quiz_size)) {
			//finishedQuizSession()
			next_link = '/quiz/finished'
		}

		updateAnswerHandler(qestion_no, function() {
			setCurrentQuestionAnswers([])
			navigate(next_link);
		})
	}

	const handleBackButton = (e) => {
		e.preventDefault();
		const back = qestion_no - 1
		let back_link = '/quiz/question/' + back

		setCurrentQuestionAnswers([])

		navigate(back_link);
	}

	const BackButton = () => {
		let classes = 'btn btn-primary btn-lg btn-back me-4'

		if (qestion_no === 1) {
			classes += ' disabled'
		}

		return (
			<button className={ classes } onClick={ handleBackButton }> <div className="d-flex align-items-center justify-content-center"><img src={ BackIcon } className="me-3" alt="Back" width="30" height="30" />  Back</div> </button>
		)
	}

	const NextButton = () => {
		let btnText = 'Next';
		let classes = 'btn btn-primary btn-lg btn-next me-2'

		if (parseInt(quizSession.quiz_size) === qestion_no) {
			btnText = 'Finish'
		}

		return (
			<button className={ classes } onClick={ handleNextButton }> <div className="d-flex align-items-center justify-content-center">{btnText} <img src={ NextIcon } className="ms-3" alt="Next" width="30" height="30"  /></div> </button>
		)
	}

    return (
		<div className="bottom-action text-center">
			<BackButton />
			<NextButton />
		</div>
    )
}

export default QuizNavigator
