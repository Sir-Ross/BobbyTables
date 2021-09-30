module.exports = {
	name: 'help',
	description: 'Displays help message or help on a specified command',
	active: true,
	usage: '`!help [<command>]`',
	execute(client,message, args) {
		// message.channel.send('Pong!');
		const { prefix } = require('../config.json');
		const data = [];
		const {commands} = message.client;

		if (!args.length){
			data.push('All available commands:');
			(commands.map(command => {
				if(command.active){
					data.push((command.name));
				}
			}));
			// data.push(data.pop().replace(',',''));
			//data.pop();//command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		// if(command.active){
			data.push(`**Name:** ${command.name}`);

			//if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.active) data.push(`**Enabled:** Yes`);else data.push(`**Enabled:** No`)
			if (command.usage) data.push(`**Usage:** ${command.usage}`);

		//data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		// }
		message.channel.send(data, { split: true });
	},
};