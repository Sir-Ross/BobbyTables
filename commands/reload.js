const {prefix,token}=require('../config.json');

module.exports = {
	name: 'reload',
	arg: true,
	description: 'Reloads a command',
	active: true,
	usage: `\`${prefix}reload <command>\``,
	execute(client,message, args) {
		if (!args.length){
			delete require.cache[require.resolve(`../main.js`)];

			message.channel.send(`\`main.js\` was reloaded!`);
			return;

		} /*return message.channel.send(`No Command Given`);*/
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`The command: \`${commandName}\` was not found`);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
		const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.log(error);
			message.channel.send(`Failed to reload the command: \`${command.name}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Command \`${command.name}\` was reloaded!`);
	},
};