//import { List, Map } from 'immutable';
import { combineReducers } from 'redux';
import rest from './rest';

function setState(state, newState) {
	return Object.assign({}, state, newState);
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
		case 'REQUEST_SECTOR':
			return {
				...state,
				isFetching: true
			}
		case 'RECEIVE_SECTOR':
			return {
				...state,
				isFetching: false,
				sectors: {
					...state.sectors,
					[action.id]: action.sector
				}
			};
		case 'REQUEST_SHIP':
			return {
				...state,
				isFetching: true
			}
		case 'RECEIVE_SHIP':
			return {
				...state,
				isFetching: false,
				ships: {
					...state.ships,
					[action.id]: action.ship
				}
			};
	}
	return state;
}

const reducer = main//combineReducers({ main, rest: rest.reducers });

export default reducer;
