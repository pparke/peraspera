import config from '../../config';

export function createEndpoint(endpoint) {
	const request = id => ({
		type: `REQUEST_${endpoint.toUpperCase()}`,
		id
	})

	const receive = (id, json) => {
		return {
			type: `RECEIVE_${endpoint.toUpperCase()}`,
			id,
			[endpoint]: json[endpoint],
			receivedAt: Date.now()
		}
	}

	const receiveDetails = (json) => {
		return {
			type: `RECEIVE_${endpoint.toUpperCase()}_DETAILS`,
			details: json[endpoint],
			receivedAt: Date.now()
		}
	}

	const sideloadRecords = (id, json, keys) => {
		return {
			type: `SIDELOAD_${endpoint.toUpperCase()}`,
			id,
			[endpoint]: json[endpoint],
			sideloaded: keys.reduce((o, key) => {
				o[key] = json[key];
				return o;
			}, {})
		};
	}

	const read = (id) => {
		return function (dispatch) {
			let url = `${config.api.url}/${endpoint}`;
			if (id) {
				url += `/${id}`;
			}
			return fetch(url, { method: 'GET' })
				.then(response => response.json())
				.then(json => dispatch(receive(id, json)));
		}
	}

	return { request, receive, receiveDetails, read };
}

export function createReducer(endpoint) {
	return (state = {}, action) => {
		switch(action.type) {
			case `REQUEST_${endpoint.toUpperCase()}`:
				return {
					...state,
					isFetching: true
				};
			case `RECEIVE_${endpoint.toUpperCase()}`:
				return {
					...state,
					isFetching: false,
					[action.id]: action[endpoint],
					ids: state.ids.concat(action.id)
				};
			case `RECEIVE_${endpoint.toUpperCase()}_DETAILS`:
				return {
					...state,
					isFetching: false,
					details: action.details
				};
		}

		return state;
	}
}
