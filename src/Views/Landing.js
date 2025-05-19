import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ConfigContext } from '../Context/ConfigContext'
import ACCALogo from '../_images/acca-logo-lg.png'
import CALogo from '../_images/ca-logo.svg'

const Landing = () => {
    const config = useContext(ConfigContext);

    useEffect(() => {
        document.title = config.app_name
    }, [])

    return (
		<div className="page-wrappr landing d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box ">
					<main className="main-wrapper landing text-center">

						<div className="animate__animated animate__zoomIn animate__faster">
							<img src={ ACCALogo } alt="acca-logo" height="150" />
						</div>

						<h4 className="my-5 animate__animated animate__fadeIn animate__delay-1s">Together with</h4>

						<div className="animate__animated animate__fadeIn animate__delay-2s">
							<img src={ CALogo } alt="ca-logo" height="100" />
						</div>

						<p>&nbsp;</p>

						<div className="animate__animated animate__fadeIn animate__delay-3s">
							<Link className="btn btn-primary btn-lg mt-5 w500px" to="/login"> Get in the game! </Link>
						</div>
						
					</main>
				</div>
			</div>
        </div>
    )
}

export default Landing
