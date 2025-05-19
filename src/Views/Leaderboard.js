import React, { useEffect, useContext } from 'react'
import { Link } from "react-router-dom";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import TopPlayersTable from '../Components/TopPlayersTable';
import { ConfigContext } from '../Context/ConfigContext'
//import { AuthContext } from '../Context/AuthContext'
import { QuizContext } from '../Context/QuizContext'
//import Swal from 'sweetalert2'
//import withReactContent from 'sweetalert2-react-content'

const Leaderboard = (props) => {
    const config = useContext(ConfigContext);
	//const swAlert = withReactContent(Swal)
	//const {logoutUser} = useContext(AuthContext);
	const {clearQuizSession} = useContext(QuizContext);

	/* const handleLogout = (e) => {
		e.preventDefault();

		swAlert.fire({
			title: 'Logout',
			text: 'Do you want to logout user?',
			showCancelButton: true,
			confirmButtonText: 'Logout',
		}).then((result) => {
			if (result.isConfirmed) {
				logoutUser().then(() => {
					clearQuizSession()
				})
			}
		})
	} */

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
		clearQuizSession()
    }, [])

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">

					<Header title={props.title} />

					<main className="main-wrapper scoreboard">
						<TopPlayersTable/>
					</main>

					<div className="bottom-action text-center">
						{/* <button className="btn btn-primary btn-lg" onClick={ handleLogout }> Logout </button> */}
						<Link className="btn btn-primary btn-lg mt-5 w500px" to="/acca/info"> About ACCA </Link>
					</div>
					
					<Footer/>
					
				</div>
			</div>
        </div>
    )
}

export default Leaderboard
