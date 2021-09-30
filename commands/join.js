module.exports = {
	name: 'join',
	description: 'Join a hidden channel!',
	active: false,
	usage: '`!join <channel name>`',
	execute(client,message, args) {
		if(args.length){
			ch = args[0].toLowerCase();
			if((message.guild.channels.cache.find(c=>c.name.toLowerCase()===(ch)))){
				chan = message.guild.channels.cache.find(c=>c.name.toLowerCase()===ch);
				if(chan.type==="text"&&chan.parent.name.toLowerCase()==="hidden"){
					chan.createOverwrite(message.guild.roles.everyone,{VIEW_CHANNEL:false});
					chan.updateOverwrite(message.author.id,{ VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGES: true });
				}
			}else{
				//channel does not exist
			}
		}else{
			//need to specify a channel
		}
	},
};