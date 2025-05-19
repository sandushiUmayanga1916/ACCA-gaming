import React, { useState, useEffect, createContext } from 'react'
//import { ConfigContext } from '../Context/ConfigContext'
import { encode, decode } from '../Helpers/EncodeDecode'

export const QuizContext = createContext()

export const QuizProvider = props => {
    //const config = useContext(ConfigContext);
    const [checkLocalStorage, setCheckLocalStorage] = useState(false);
    const [quizSession, setQuizSession] = useState({ is_started : false, is_completed: false });
	const [quizExpiresTime, setQuizExpiresTime] = useState(null);
	const [lastQuestionNo, setLastQuestionNo] = useState(1);
	const [quizQuestions, setQuizQuestions] = useState({});
	const [userAnswers, setUserAnswers] = useState({});
    const [quizResult, setQuizResult] = useState({});
    
    const getLoalStorageSession = () => {
        try {
            const sessionJSON = localStorage.getItem("quiz_session");
            if (sessionJSON) {
                return JSON.parse(decode(sessionJSON));
            }
        } catch(err) {
            return false;
        }
        return false;
    }

    const getQuizExpiresTime = (session) => {
        try {
			const end_time = parseInt(session.session_end);
            const timestamp = Math.floor(Date.now() / 1000)
            return (end_time - timestamp)
        } catch(err) {
            return 0;
        }
    }

    const finishedQuizSession = () => {
		if (quizSession.is_started) {
			let new_session_data = {...quizSession}
			new_session_data.is_completed = true; 
	
			setQuizSession(new_session_data)
			localStorage.setItem('quiz_session', encode(JSON.stringify(new_session_data)));
		}
    }

	const clearQuizSession = () => {
        localStorage.removeItem('quiz_session');
        setQuizSession({ is_started : false, is_completed: false })
		setQuizExpiresTime(null)
		setLastQuestionNo(1)
		setQuizQuestions({})
		setUserAnswers({})
    }

    const checkLoalStorageQuiz = () => {
        try {
            if (checkLocalStorage === false && quizSession.is_started === false) {
                setCheckLocalStorage(true)
                const session = getLoalStorageSession();

                if (session !== false) {
                    const expires = getQuizExpiresTime(session)
        
                    if (expires <= 0) {
                        finishedQuizSession()
                        //setLoading(false)
                    } else {
						setQuizSession(session)
						setLastQuestionNo(session.start_question)
						setQuizQuestions(session.user_questions);
						setUserAnswers(session.user_answers);
						setQuizResult(session.result);
						//setLoading(false)
                    }
                }
            }
        } catch(err) {
            clearQuizSession()
        }
       
    }

    checkLoalStorageQuiz()

	useEffect(() => {
        if ( quizSession.is_started === true) {
			let new_session_data = {...quizSession}
			new_session_data['start_question'] = lastQuestionNo

			setQuizSession(new_session_data)

			localStorage.setItem('quiz_session', encode(JSON.stringify(new_session_data)));
        }
    }, [lastQuestionNo])

	useEffect(() => {
        if ( quizSession.is_started === true) {
			let new_session_data = {...quizSession}
			new_session_data['user_questions'] = quizQuestions

			setQuizSession(new_session_data)

			localStorage.setItem('quiz_session', encode(JSON.stringify(new_session_data)));
        }
    }, [quizQuestions])

	useEffect(() => {
        if ( quizSession.is_started === true) {
			let new_session_data = {...quizSession}
			new_session_data['user_answers'] = userAnswers

			setQuizSession(new_session_data)

			localStorage.setItem('quiz_session', encode(JSON.stringify(new_session_data)));
        }
    }, [userAnswers])

	useEffect(() => {
        if ( quizSession.is_started === true) {
			let new_session_data = {...quizSession}
			new_session_data['result'] = quizResult

			setQuizSession(new_session_data)

			localStorage.setItem('quiz_session', encode(JSON.stringify(new_session_data)));
        }
    }, [quizResult])

	const showReadableTime =  (avg_time) => {
		var distance = avg_time;

		var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
		var minutes = Math.floor((distance % (60 * 60)) / (60));
		var seconds = Math.floor((distance % (60)) );

		let output = '';

		if (hours > 0) output = hours + "h ";

		output += minutes.toString().padStart(2, '0') + "m " + seconds.toString().padStart(2, '0') + "s ";

		return output;
	}

    return (
        <QuizContext.Provider value={{ 
			quizSession, setQuizSession,
			quizExpiresTime,
			lastQuestionNo, setLastQuestionNo,
			quizQuestions, setQuizQuestions,
			userAnswers, setUserAnswers,
			quizResult, setQuizResult,
			finishedQuizSession, clearQuizSession,
			showReadableTime
		}}>
            {props.children}
        </QuizContext.Provider>
    )
}
