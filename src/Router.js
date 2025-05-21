import React from 'react'
import { HashRouter, Routes, Route } from "react-router-dom";
import LoginRoute from './Middleware/LoginRoute'
import PrivateRoute from './Middleware/PrivateRoute'
import CheckProfileRoute from './Middleware/CheckProfileRoute'
import QuizRoute from './Middleware/QuizRoute'

import NotFound from './Views/NotFound';
import Landing from './Views/Landing';
import Login from './Views/Auth/Login';
import Register from './Views/Auth/Register';
import PasswordForgot from './Views/Auth/PasswordForgot';
import PasswordReset from './Views/Auth/PasswordReset';
import Presentation from './Views/Presentation';
import QuizInstructions from './Views/QuizInstructions';
import Video from './Views/Video';
import QuizStart from './Views/QuizStart';
import QuizQuestions from './Views/QuizQuestions';
import QuizFinished from './Views/QuizFinished';
import Leaderboard from './Views/Leaderboard';
import ACCAPage from './Views/ACCAPage';

import Profile from './Views/Profile';

const Router = () => {
    return (
        <HashRouter basename={process.env.PUBLIC_URL} >
            <Routes>
                <Route path="/login" element={<LoginRoute> <Login title="Login"/> </LoginRoute>}/>
				<Route path="/register" element={<LoginRoute> <Register title="Register"/> </LoginRoute>}/>
				<Route path="/password/forgot" element={<LoginRoute> <PasswordForgot title="Forgot Password"/> </LoginRoute>}/>
				<Route path="/password/reset/:token" element={<LoginRoute> <PasswordReset title="Reset Password"/> </LoginRoute>}/>

				<Route path="/profile" element={<PrivateRoute> <Profile title="Update Profile"/> </PrivateRoute>}/>

				<Route path="/leaderboard" element={<PrivateRoute> <CheckProfileRoute> <Leaderboard title="Leaderboard"/> </CheckProfileRoute> </PrivateRoute>} />
                <Route path="/quiz/finished" element={<PrivateRoute> <CheckProfileRoute> <QuizFinished title="Quiz Finished"/> </CheckProfileRoute> </PrivateRoute>} />
                <Route path="/quiz/question/:qestion_no" element={<PrivateRoute> <CheckProfileRoute> <QuizRoute> <QuizQuestions title="MCQs on UN SDGs"/> </QuizRoute> </CheckProfileRoute> </PrivateRoute>} />
				<Route path="/quiz/start" element={<PrivateRoute> <CheckProfileRoute> <QuizStart title="Proceed to the Quiz"/> </CheckProfileRoute> </PrivateRoute>}/>
				<Route path="/video/unsdg" element={<PrivateRoute> <CheckProfileRoute> <Video title="UNSDGs Video"/> </CheckProfileRoute> </PrivateRoute>}/>
				<Route path="/quiz/instructions" element={<PrivateRoute> <CheckProfileRoute> <QuizInstructions title="Quiz Instructions"/> </CheckProfileRoute> </PrivateRoute>}/>
				<Route path="/video/presentation" element={<PrivateRoute> <CheckProfileRoute> <Presentation title="Your future with ACCA"/> </CheckProfileRoute> </PrivateRoute>}/>
				<Route path="/acca/info" element={<PrivateRoute> <CheckProfileRoute> <ACCAPage title="ACCA"/> </CheckProfileRoute> </PrivateRoute>}/>

				<Route path="/" element={<LoginRoute> <Landing title=""/> </LoginRoute>}/>

                <Route path="*" element={<NotFound title="Page Not Found"/>} />
            </Routes>
        </HashRouter>
    )
}

export default Router
