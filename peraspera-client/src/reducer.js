import { List, Map } from 'immutable';

function setState(state, newState) {
	return state.merge(newState);
}

function showSectorMap(state, sectorId) {
	//return state.updateIn([])
}

export default function(state = Map(), action) {
	switch(action.type) {
		case 'SET_STATE':
			return setState(state, action.state);
		case 'SHOW_SECTOR_MAP':
			return showSectorMap(state, sectorId);
	}
	return state;
}
