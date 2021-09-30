module.exports = {
	name: 'slap',
	description: 'Slap someone!',
	active: true,
	usage: '`!slap [<victim>]`',
	execute(client,message, args) {
		// message.channel.send('Pong!');
		if(args.length){
			message.channel.send(message.author.username+" slapped "+args[0]+" around a bit with a rather large fishbot!");
		}else{
			message.channel.send("Bobby Tables slapped "+message.author.username+" around a bit with a rather large fishbot!");
		}
	},
};