import { combineReducers } from 'redux';
import { createReducer } from './actions/rest';

function setState(state, newState) {
	return Object.assign({}, state, newState);
}

function showSectorMap(state, sectorId) {
	//return state.updateIn([])
}

const ships = createReducer('ships');
const sectors = createReducer('sectors');
const systems = createReducer('systems');
const wormholes = createReducer('wormholes');

function main(state = {}, action) {
	switch(action.type) {
		case 'SET_STATE':
			return setState(state, action.state);
		case 'SHOW_SECTOR_MAP':
			return showSectorMap(state, sectorId);
	}
	return state;
}

// TODO rename main? separate player reducer and state
const reducer = combineReducers({ main, ships, sectors, systems });

export default reducer;
