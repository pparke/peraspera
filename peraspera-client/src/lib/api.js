import config from '../../config.js';

export function checkContentType(response, expected = 'application/json') {
	const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf(expected) === -1) {
		throw new Error(`Expected ${expected} but got ${contentType}`);
  }
}

export async function getSystems(id) {
	let url = `${config.api.url}/systems`;
	if (id) {
		url += `/${id}`;
	}
  const response = await fetch(url, { method: 'GET' });
  checkContentType(response);
  const json = await response.json();
  return json.systems;
}

export async function getStarTypes() {
	const response = await fetch(`${config.api.url}/starTypes`, { method: 'GET' });
	checkContentType(response);
	const json = await response.json();
	return json.starTypes;
}

export async function getWormholes() {
	const response = await fetch(`${config.api.url}/wormholes`, { method: 'GET' });
	checkContentType(response);
	const json = await response.json();
	return json.wormholes;
}

export async function getShips(id) {
	let url = `${config.api.url}/ships`;
	if (id) {
		url += `/${id}`;
	}
	const response = await fetch(url, { method: 'GET' });
	checkContentType(response);
	const json = await response.json();
	return json.ships;
}

export async function joinGame() {
	const response = await fetch(`${config.api.url}/game/join?name=Valiant`, { method: 'GET' });
	checkContentType(response);
	const json = await response.json();
	return json.ship;
}

export async function move(dest) {
	const data = {
		ship: 1,
		to: dest
	}
	const response = await fetch(`${config.api.url}/game/move`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
	checkContentType(response);
	const json = await response.json();
	return json.move;
}
