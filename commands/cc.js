const {prefix,token,youtube_api,wolfram_api}=require('../config.json');
const Client = require('@william5553/wolframalpha');
const Wolfram = new Client(wolfram_api);
const Discord = require('discord.js');


module.exports = {
	name: 'cc',
	description: 'Send a query to Wolfram Alpha',
	active: true,
	usage: `\`${prefix}cc <query>`,
	async execute(client,message, args) {
		var query = args.join(" ");
		var out = [];

		var titles = [];
		var infos  = [];

		var embed = new Discord.MessageEmbed()
			.setColor('#0099ff');
		Wolfram.query(query,function(err,result){
			if(err) throw err;
			if(!result.queryresult.pod){
				message.channel.send("Not Found");
				return;
			}
			for(var i=0;i<result.queryresult.pod.length;i++){
				const pod = result.queryresult.pod[i];
				if(pod.$.title=="Input"){
					embed.setTitle(`${pod.$.title}:`);
				}else console.log(pod.$.title,": ");

				for(var j=0;j<pod.subpod.length;j++){
					const subpod = pod.subpod[j];
					for(var k=0;k<subpod.plaintext.length;k++){
						const text = subpod.plaintext[k];
						console.log('\t',text);
						if(pod.$.title=="Input"){
							embed.setDescription(`${text}`);
						}else if(text.length)embed.addField(`${pod.$.title}:`,`${text}`);
					}
				}
			}
			embed.setTimestamp();
			embed.setFooter(`Query by ${message.author.username}`,`${message.author.displayAvatarURL()}`);
			console.log(embed);
			message.channel.send(embed);
			/*var q = result.queryresult.pod[0].subpod[0].plaintext[0].replace(" | "," ");
			console.log("Result: %j", result);
			console.log(q);
			// console.log(result.queryresult.pod[1]);
			// console.log(result.queryresult.pod[1].subpod);
			for(var i=0;i<result.queryresult.pod[1].subpod.length;i++){
				for(var j=0;j<result.queryresult.pod[1].subpod[i].plaintext.length;j++){
					console.log(result.queryresult.pod[1].subpod[i].plaintext[j]);
					out.push(result.queryresult.pod[1].subpod[i].plaintext[j]);

				}
			}
			if(out.length)message.channel.send(q+": `"+out.join(", ")+"`");*/
			
		});

	},
};