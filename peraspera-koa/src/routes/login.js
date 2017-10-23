import User from '../models/User';
import Passwd from '../models/Passwd';
import router from 'koa-router';
import config from '../config';

const login = router();

login.post('/', async (ctx, next) => {
	const { db } = ctx;

	const auth = ctx.headers.authorization;

	// attempt to authorize with the received headers
	const passwd = Passwd.passwordAuth(db, auth);

	ctx.body = ctx.body || {};
	ctx.body.token = passwd.token_public;
	ctx.body.userid = passwd.user_id;
	ctx.body.expires = passwd.token_expires;

	try {
		ctx.body.user = await passwd.user(db);
	}
	catch (err) {
		console.log(err);
		ctx.throw(err.status, err);
	}

	await next();
});

login.post('/new', async (ctx, next) => {
	const { db, request } = ctx;
	const details = {};

	console.log('request is', request.body)

	details.handle = request.body.handle;
	details.username = request.body.username;
	details.password = request.body.password;
	details.email = request.body.email;

	if (!details.username || !details.password) {
		ctx.throw(400, new Error('Missing username or password'));
	}

	try {
		const { user, passwd } = await User.create(db, details);
		console.log('=> Account created.');

		ctx.body = ctx.body || {};
		ctx.body.userid = user.id.toString();
		ctx.body.token_public = passwd.token_public;
		ctx.body.token_expires = passwd.token_expires;
	}
	catch (reason) {
		console.log('Account creation failed');
		console.log(reason);

		if (reason.code === 11000) {
			ctx.throw(400, new Error('That username is already taken.'));
		}

		// validation errors
		if (reason.name === 'ValidationError') {
			ctx.throw(400, new Error('Validation Error', reason.message));
		}

		ctx.throw(500, reason);
	}

	await next();
});

export default login;
