module.exports = {
	name: 'leave',
	description: 'Leave a hidden channel!',
	active: false,
	usage: '`!leave <channel name>`',
	execute(client,message, args) {
		// message.channel.send('Pong!');
		if(args.length){
			//console.log(message.guild.channels.cache.find(c=>c.name.toLowerCase()===(args[0])));
			ch = args[0].toLowerCase();
			if((message.guild.channels.cache.find(c=>c.name.toLowerCase()===(ch)))){
				//console.log(message.guild.channels.cache.get(ch));
				chan = message.guild.channels.cache.find(c=>c.name.toLowerCase()===ch);
				//console.log(chan.type);
				if(chan.type==="text"&&chan.parent.name.toLowerCase()==="hidden"){
					
					chan.createOverwrite(message.guild.roles.everyone,{VIEW_CHANNEL:false});
					chan.permissionOverwrites.get(message.author.id).delete();
					//chan.updateOverwrite(message.author.id,{ VIEW_CHANNEL: false, SEND_MESSAGES: false, READ_MESSAGES: false });
				}
				//message.guild.channels.cache.get(ch).overwritePermissions(message.author.id,{SEND_MESSAGES: true, READ_MESSAGES: true, ADD_REACTIONS: true});
				//console.log("Joined");
			}else{
				//channel does not exist
			}
		}else{
			//need to specify a channel
		}
	},
};