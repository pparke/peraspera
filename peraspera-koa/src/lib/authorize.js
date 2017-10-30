import Passwd from '../models/Passwd';
import hash from '../lib/hash';
import randomToken from '../lib/randomToken';

export default async function authorize(db, auth) {
  if (!auth) {
	throw new Error('No authorization provided');
  }

  // decode auth header
  const encoded = auth.split(' ');
  const buf = new Buffer(encoded[1], 'base64');
  const plainText = buf.toString();

  // split auth into username and password
  const userpass = plainText.split(':');
  const username = userpass[0];
  const password = userpass[1];

  // both are required
  if (!username || !password) {
	throw new Error('No username or password given.');
  }

  const passwd = await Passwd.findWhere(db, Passwd, { username });

  if (!passwd) {
	throw new Error('Passwd not found');
  }

  // hash the password we got from the user
  const { salt, key } = await hash(password, passwd.salt);

  // check if the hashed passwords match
  if (key.toString('hex') === passwd.password) {
	// generate a new public token, save and return
	const publicToken = randomToken(30);
	// expires in one week
	const expires = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7));

	passwd.token_public = publicToken;
	passwd.token_expires = expires.toUTCString();

	await passwd.save(db);

  }
  else {
	throw new Error('Passwords do not match.');
  }

  return passwd;
}
