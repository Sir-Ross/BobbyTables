const {prefix,token} = require('../../config.json');

module.exports = {
	name: 			'8',
	description: 	'Ask for the wisdom of the almighty Magic 8-Ball!',
	active: 		true,
	usage: 			`\`${prefix}8 [i]\``,
	async execute(client,message,args){
		var Discord = require('discord.js');
		var responses = ["As I see it, yes.","Ask again later","Better not tell you now.","Cannot predict now.","Concentrate and ask again.",
						 "Don't count on it.","It is certain.","It is decidedly so.","Most likely.","My reply is no.","My sources say no.",
						 "Outlook not so good.","Outlook good.","Reply hazy, try again.","Signs point to yes.","Very doubtful.","Without a doubt.","Yes.","Yes - definitely.","You may rely on it."];
		r = Math.floor(Math.random()*(20));
		if(args.length){
			if(args[0]==='i'){
				const file = new Discord.MessageAttachment('8ball/'+r+'.png');
				message.channel.send(file);
				return;
			}
		}
		message.channel.send(resposes[r]);
	}
}