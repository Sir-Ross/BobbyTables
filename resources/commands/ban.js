const {prefix,token} = require('../../config.json');

module.exports = {
	name: 			'ban',
	description: 	'Bans a user from interacting with this bot.',
	active: 		true,
	usage: 			`\`${prefix}ban <@user>\``,
	async execute(client,message,args){
		//need to implement admin functionality
		message.channel.send('Unimplemented');
	}
}