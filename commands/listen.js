module.exports = {
	name: 'listen',
	arg: true,
	description: 'Creates a listener TCP connection on port!',
	active: true,
	usage: '`!listen <port>`',
	execute(client,message, args) {
		if(message.author.id === '145605139070320640'){
			var net = require('net');
			var port;
			if (!args.length){
				port = 2133;	
			}else{
				port = args[0];
			}

			var server = net.createServer(function(socket){
				console.log("Listening to "+port);
				socket.pipe(socket);
				socket.on('data',function(data){
					console.log('Received: '+data);
				});
				socket.on('close',function(data){
					console.log('Disconnected');
					server.destroy();
				});
			});

			server.listen(port, '127.0.0.1');


		}else message.channel.send("Invalid Permissions!");
	},
};