import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ConfigContext } from '../Context/ConfigContext'
import Footer from '../Components/Footer';

const NotFound = (props) => {
	const config = useContext(ConfigContext);

    useEffect(() => {
        document.title = props.title + ' | ' + config.app_name
    }, [])

    return (
		<div className="page-wrappr d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="app-box">

					<main className="main-wrapper">
						<div className="py-5 text-center">

							<h1>Page Not Found</h1>
							<p className="code">Error Code : 404</p>
							<p>It looks like nothing was found at this location.</p>

							<Link className="btn btn-primary" to="/"> Go to Home </Link>
							
						</div>
					</main>

					<Footer />
				</div>
			</div>
        </div>
    )
}

export default NotFound
