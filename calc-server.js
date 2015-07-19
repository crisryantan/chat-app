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

	sockets.forEach(function (sock) {
		sock.write( sock.username + ' connected from server\n');
	});

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

			var text = data.toString().split( ' ' );

			if ( text[ 0 ] === '\/rename' ) {
				text.shift();

				// remove \r\n on last element of string
				text[ text.length - 1 ] = text[ text.length - 1 ].replace( '\r\n', '' );
				text = text.toString().replace( ',', ' ' );

				var prevUsername = self.username;
				self.username = text;

				sock.write( prevUsername + ' changed username to : ' + self.username + '\n' );
			}

		});
	});

})
	.listen(31337, init);

function init(err) {
	if (!err) {
		console.log('server running on port 31337');
	}
}

