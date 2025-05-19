import React from 'react'

const Footer = () => {
    return (
		<footer className="footer">
			<div className="row align-items-center">
				<div className="col-md-8">
					<p>© 2022 ACCA Real World Challenge. All rights reserved. <span className="hide-m">|</span> <span className="dev">Developed @ <a href="https://www.enfection.com/" target="_blank" rel="noreferrer">Enfection</a></span></p>
				</div>
				<div className="col-md-4 mt-3 mt-md-0 text-md-end">
					<p>
						<a href="https://www.accaglobal.com/lk/en/footertoolbar/legal.html" target="_blank" rel="noreferrer">Legal Policies</a> <span className="hide-m sep">|</span> <a href="https://www.accaglobal.com/lk/en/footertoolbar/privacy.html" target="_blank" rel="noreferrer">Data Protection & Cookies</a>
					</p>
				</div>
			</div>
		</footer>
    )
}

export default Footer
