export function setState(state) {
	return {
		type: 'SET_STATE',
		state
	}
}

export function showSectorMap(state) {
	return {
		type: 'SHOW_SECTOR_MAP',
		state
	}
}

export function showGalaxyMap(state) {
	return {
		type: 'SHOW_GALAXY_MAP',
		state
	}
}

export function showShipDetails(state) {
	return {
		type: 'SHOW_SHIP_DETAILS',
		state
	}
}

export function receiveSectorDetails(sector, json) {
	return {
		type: 'RECEIVE_SECTOR_DETAILS',
		sector,
		data: json.data,
		receivedAt: Date.now()
	}
}

export function receiveGalaxyDetails(json) {
	return {
		type: 'RECEIVE_GALAXY_DETAILS',
		data: json.data,
		receivedAt: Date.now()
	}
}

export function receiveShipDetails(json) {
	return {
		type: 'RECEIVE_SHIP_DETAILS',
		data: json.data,
		receivedAt: Date.now()
	}
}

// http://redux.js.org/docs/advanced/AsyncActions.html
export function fetchSectorDetails(sector) {
	return function (dispatch) {
		dispatch(showSectorMap);

		return fetch(`http://localhost:3000/sectors/${sector}`)
			.then(response => response.json())
			.then(json => dispatch(receiveSectorDetails(sector, json)));
	}
}
