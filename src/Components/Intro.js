import React from 'react'
import Logo from '../_images/logo.png'
import CALogo from '../_images/ca-logo.svg'

const Intro = () => {
    return (
		<div className="intro text-center">
			<div className="logo">
				<img src={ Logo } alt="logo" />
			</div>
			<p className="my-4">Together with</p>
			<div>
				<img src={ CALogo } alt="ca-logo" height="75" />
			</div>
		</div>
    )
}

export default Intro
