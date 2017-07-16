const apiUrl = 'http://localhost:3000';

export async function getSystems() {
	const response = await fetch(`${apiUrl}/systems`, { method: 'GET' });
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') === -1) {
		throw new Error(`Expected JSON but got ${contentType}`)
  }

	return response.json();
}

export function checkContentType(response, expected = 'application/json') {
	const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf(expected) === -1) {
		throw new Error(`Expected ${expected} but got ${contentType}`);
  }
}
