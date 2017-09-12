//import { List, Map } from 'immutable';
import { combineReducers } from 'redux';
import rest from './rest';

function setState(state, newState) {
	return state.merge(newState);
}

function showSectorMap(state, sectorId) {
	//return state.updateIn([])
}

function main(state = {}, action) {
	switch(action.type) {
		case 'SET_STATE':
			return setState(state, action.state);
		case 'SHOW_SECTOR_MAP':
			return showSectorMap(state, sectorId);
	}
	return state;
}

const reducer = combineReducers({ main, rest: rest.reducers });

export default reducer;
