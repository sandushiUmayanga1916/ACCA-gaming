import React, { useState, useEffect, useContext, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../Components/LoadingSpinner';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { AuthContext } from '../Context/AuthContext'
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'

//import NextIcon from '../_images/next.svg'

const Presentation = (props) => {
    const config = useContext(ConfigContext);
	const {authUser} = useContext(AuthContext);
	const {quizSession, lastQuestionNo} = useContext(QuizContext);
	const navigate = useNavigate();

	const [videoUrl, setVideoUrl] = useState(null);
	const [videoPoster, setVideoPoster] = useState(null);
	const videoElement = useRef(null);
	//const [hasVideoSkip, setVideoSkip] = useState(false);

	let supposedCurrentTime = 0;

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
		setVideoUrl(config.videos.acca.video)
		setVideoPoster(config.videos.acca.poster)

		const skipVideo = localStorage.getItem("skip_video_" + authUser.uid);
		if (skipVideo === 'true') {
			//setVideoSkip(true);
		}
    }, [])

	const videoTimeUpdateHandler = (e) => {
		if (!videoElement.current.seeking) {
			supposedCurrentTime = videoElement.current.currentTime
	  	}
	}

	const videoSeekingHandler = (e) => {
		var delta = videoElement.current.currentTime - supposedCurrentTime;

		if (Math.abs(delta) > 0.01) {
			videoElement.current.currentTime = supposedCurrentTime;
		}
	}

	const videoEndedHandler = (e) => {
		localStorage.setItem('skip_video_' + authUser.uid, true);
		navigate('/quiz/instructions');
	}

	const VideoPlayer  = () => {
        if (videoUrl === null) {
            return (
                <div className="loading-spinner"> 
                    <LoadingSpinner/>
                    <span>Content Loading...</span>
                </div>
            )
        } else {
            return (
				<div className="ratio ratio-16x9">
					<video width="320" height="240" controls poster={videoPoster} onTimeUpdate={videoTimeUpdateHandler} onSeeking={videoSeekingHandler} onEnded={videoEndedHandler} ref={videoElement} onContextMenu={e => e.preventDefault()}>
						<source src={ videoUrl } type="video/mp4"/>
						Your browser does not support the video tag.
					</video>
				</div>
            )
        }
    }

	if (quizSession.is_started === true  && quizSession.is_completed === false) {
		return (
			<Navigate to={ '/quiz/question/' + lastQuestionNo }  />
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

					<Header title={props.title} />

					<main className="main-wrapper">
						<VideoPlayer/>
						{/* {(hasVideoSkip) ? (
							<div className="skip-video">
								<Link className="btn btn-primary btn-lg" to="/unsdg-video"> Skip this Video <img src={ NextIcon } className="ms-3" alt="Next" width="30" height="30"  /> </Link>
							</div>
						) : null} */}
					</main>
					
					<Footer/>

				</div>
			</div>
        </div>
    )
}

export default Presentation
