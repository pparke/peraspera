import { createEndpoint } from './actions/rest';

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

export const { read: shipRead } = createEndpoint('ships');
export const { read: sectorRead } = createEndpoint('sectors');
export const { read: systemRead } = createEndpoint('systems');
export const { read: wormholeRead } = createEndpoint('wormhole');
