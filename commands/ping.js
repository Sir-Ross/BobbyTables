const {prefix,token}=require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	active: true,
	usage: `\`${prefix}ping\``,
	async execute(client,message, args) {
		const m = await message.channel.send("Ping?");
    	m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms`);
	},
};