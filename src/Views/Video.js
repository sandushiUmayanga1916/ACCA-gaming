import React, { useState, useEffect, useContext, useRef } from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from '../Components/LoadingSpinner';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { ConfigContext } from '../Context/ConfigContext'
import { QuizContext } from '../Context/QuizContext'

import Marquee from "react-fast-marquee";
import LogosImg from '../_images/logos'

const Video = (props) => {
    const config = useContext(ConfigContext);
	const {quizSession, lastQuestionNo} = useContext(QuizContext);
	const navigate = useNavigate();

	const [videoUrl, setVideoUrl] = useState(null);
	const [videoPoster, setVideoPoster] = useState(null);
	const videoElement = useRef(null);

	let supposedCurrentTime = 0;

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
		setVideoUrl(config.videos.un_sdg.video)
		setVideoPoster(config.videos.un_sdg.poster)
    }, [])

	const videoTimeUpdateHandler = (e) => {
		/* if (!videoElement.current.seeking) {
			supposedCurrentTime = videoElement.current.currentTime
	  	} */
	}

	const videoSeekingHandler = (e) => {
		/* var delta = videoElement.current.currentTime - supposedCurrentTime;

		if (Math.abs(delta) > 0.01) {
			videoElement.current.currentTime = supposedCurrentTime;
		} */
	}

	const videoEndedHandler = (e) => {
		supposedCurrentTime = 0
		navigate('/quiz/start');
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
					<video width="320" height="240" controls poster={videoPoster} onTimeUpdate={videoTimeUpdateHandler} onSeeking={videoSeekingHandler} onEnded={videoEndedHandler} ref={videoElement}>
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

					<Header title={props.title} back={ '/quiz/instructions' } />

					<div className="logo-marquee">
						<Marquee speed={40} pauseOnHover={true} gradient={false}>
							{LogosImg.map((img, index) => 
								(
									<img key={index} src={img} className="mx-1" height="125" alt="logo-{index + 1}" />
								)
							)}
						</Marquee>
					</div>

					<main className="main-wrapper">
						<VideoPlayer/>
						<p className="text-center mt-3">NOTE : You must watch this video until the end to start the quiz.</p>
					</main>
					
					<Footer/>
				</div>
			</div>
        </div>
    )
}

export default Video
