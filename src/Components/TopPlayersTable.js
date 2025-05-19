import React, { useState, useEffect, useContext } from 'react'
import LoadingSpinner from '../Components/LoadingSpinner';
import { ConfigContext } from '../Context/ConfigContext'
import { AuthContext } from '../Context/AuthContext'
import { QuizContext } from '../Context/QuizContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const TopPlayersTable = () => {
	const config = useContext(ConfigContext);
	const swAlert = withReactContent(Swal)
	const {authUser} = useContext(AuthContext);
	const {showReadableTime} = useContext(QuizContext);
	const [topPlayers, setTopPlayers] = useState(null);

	 useEffect(() => {
		if (topPlayers === null) {
			fetchScoreboard()
		}
    }, [])

	const fetchScoreboard = async () => {
        fetch(config.api_url + 'scoreboard', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
				'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + authUser.access_token
            }
        })
        .then(res => {
            return res.json()
        })
        .then((result) => {
            if (result.status === 'success') {
				setTopPlayers(result.top_players)
            }
        }, (error) => {
            swAlert.fire(
				'Oops! Something went wrong',
				'Request failed. Please contact the system administrator.'
			)
        })
	}

	if (topPlayers === null) {
		return (
			<div className="loading-spinner"> 
				<LoadingSpinner/>
				<span>Content Loading...</span>
			</div>
		)
	} else {
		return (
			<table className="table table-bordered m-0">
				<thead>
					<tr>
						<th scope="col" className="text-center" width="75">#</th>
						<th scope="col">Name</th>
						<th scope="col">School</th>
						<th scope="col" className="text-center" width="150">Avg. Time</th>
						<th scope="col" className="text-center" width="100">Score</th>
					</tr>
				</thead>
				<tbody>
					{topPlayers.map((player, index) =>
						<tr key={ index }>
							<th scope="row" className="text-center" data-label="Place"> <span className="place-number">{(index + 1)}</span> </th>
							<td data-label="Name">{player.name}</td>
							<td data-label="School">{player.school}</td>
							<td className="text-center" data-label="Avg. Time">{showReadableTime(player.avg_time)}</td>
							<td className="text-center" data-label="Score">{parseInt(player.sum_score)}</td>
						</tr>
					)}
				</tbody>
			</table>
		)
	}
}

export default TopPlayersTable
