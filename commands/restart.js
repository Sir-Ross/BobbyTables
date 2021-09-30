const {prefix,token}=require('../config.json');

module.exports = {
	name: 'restart',
	description: 'Leave a hidden channel!',
	active: true,
	usage: `\`${prefix}leave <channel name>\``,
	execute(client,message, args) {
		const { prefix, token } = require('../config.json');
		a = (message.author.id === '145605139070320640');// false;
		// message.member.roles.cache.each(role => {
		// 	if(role.name==="Staff"){
		// 		a=true;
		// 	}
		// });
		if(a){
			message.channel.send("Restarting...")
			.then(process.exit());/*msg => client.destroy())
			.then(() => client.login(token));*/
		}else{
			message.channel.send("You do not have permission to use this command!");
		}
	},
};