const connection = io();
connection.on('connection', (socket) => {
	console.log('I connected :)');
});

connection.on('event', (data) => {
	console.log(`I got some data ${data}`);
});

connection.on('msg', (data) => {
	console.log(`I got a message ${data}`);
});
