import Koa from 'koa';
import config from './config';
import koaRouter from 'koa-router';
import * as routes from './routes';
import { database } from './lib/database';
import bodyParser from 'koa-bodyparser';
import errorHandler from './lib/errorHandler';
import morgan from 'koa-morgan';
import fs from 'fs';
import path from 'path';
import cors from 'kcors';
import session from 'koa-session2';
import SessionStore from './lib/SessionStore';
import IO from 'socket.io';
import staticServer from 'koa-static';

const app = new Koa();
const api = koaRouter();
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, '..', 'logs', 'access.log'),
	{ flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }))
	.use(morgan('dev'))
	.use(errorHandler)
	.use(cors())
	.use(bodyParser())
	.use(database)
	.use(staticServer(path.join(__dirname, '..', 'public')));

app.use(session({
	store: new SessionStore()
}));

// connect api endpoints to routes based on name
for(const route in routes) {
	api.use(`/${route}`, routes[route].routes(), routes[route].allowedMethods());
}

// router middleware
app.use(api.routes())
.use(api.allowedMethods());

// start listening
const server = app.listen(config.api.port || 3000, () => {
	console.log(`Koa is now listening on port ${config.api.port}`);
});

// socket.io
const io = new IO(server);

io.on('connection', (socket) => {
	console.log(`New Connection!\n=> from ${socket.id}`);
	io.emit('msg', `[All]: ${socket.id} joined.`);
});
