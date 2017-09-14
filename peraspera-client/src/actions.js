import config from '../config';

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

export function receiveGalaxyDetails(json) {
	return {
		type: 'RECEIVE_GALAXY_DETAILS',
		data: json.data,
		receivedAt: Date.now()
	}
}

export const requestSector = sector => ({
	type: 'REQUEST_SECTOR',
	sector
})

export function receiveSector(id, json) {
	return {
		type: 'RECEIVE_SECTOR',
		id,
		sector: json.sectors,
		receivedAt: Date.now()
	}
}

export const requestShip = ship => ({
	type: 'REQUEST_SHIP',
	ship
})

export function receiveShip(id, json) {
	console.log('receive ship', id, json)
	return {
		type: 'RECEIVE_SHIP',
		id,
		ship: json.ships,
		receivedAt: Date.now()
	}
}

// http://redux.js.org/docs/advanced/AsyncActions.html
export function fetchShip(ship) {
	return function (dispatch) {
		return fetch(`${config.api.url}/ships/${ship}`, { method: 'GET' })
		.then(response => response.json())
		.then(json => dispatch(receiveShip(ship, json)));
	}
}

export function fetchSector(sector) {
	return function (dispatch) {

		return fetch(`${config.api.url}/sectors/${sector}`, { method: 'GET' })
			.then(response => response.json())
			.then(json => dispatch(receiveSector(sector, json)));
	}
}
