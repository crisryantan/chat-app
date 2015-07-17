'use strict';

var net = require('net');

var sockets = [];

net.createServer(function(socket) {
	//
	// store socket
	socket.write('Welcome to Calculator Service\n');
	socket.write('-------------------------------------\n');

	// store socket to an array list so we can message them
	socket.username = 'User ' + Date.now();
	sockets.push(socket);

	socket.on('close', function (socket) {
		sockets.splice(sockets.indexOf(socket), 1);
		sockets.forEach(function (sock) {
			sock.write(sock.username + ' disconnected from server');
		});
	});

	socket.on('data', function (data) {
		var self = this;

		sockets.forEach(function(sock) {
			sock.write(self.username + '> ' + data);
		});
	});

})
	.listen(31337, init);

function init(err) {
	if (!err) {
		console.log('server running on port 31337');
	}
}

