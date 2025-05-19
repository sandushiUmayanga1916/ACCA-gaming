const backend_url = process.env.REACT_APP_BACKEND_URL

const Config = {
	app_name : 'ACCA Real World Challenge',
    api_url : backend_url + '/api/',
	google : {
		client_id: '1088117506588-tb0mgnm4fkima2il9bgjirktdrblicev.apps.googleusercontent.com'
	},
	videos : {
		acca : {
			video : backend_url + '/videos/acca-video.mp4',
			poster : backend_url + '/videos/acca-video-thumb.jpg'
		},
		un_sdg : {
			video : backend_url + '/videos/un-sdg-video.mp4',
			poster : backend_url + '/videos/un-sdg-video-thumb.jpg'
		}
	}
}

export default Config