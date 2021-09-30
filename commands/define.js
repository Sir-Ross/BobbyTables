const {prefix,token}=require('../config.json');

module.exports = {
	name: 'define',
	description: 'Define a word!',
	active: true,
	usage: `\`${prefix}define <query> [<language>]\``,
	async execute(client,message, args) {
		var wd = require("word-definition");
		if(args.length){
			var lang = "en";
			if(args.length>1) lang = args[1];
			wd.getDef(args[0],lang,null,function(definition){
				console.log(definition);
				if(definition.definition!=null)message.channel.send({
					"embed": {
						"title" : definition.word,
						"description" : definition.category + ".\n\t" + definition.definition,
						"color" : 10000002
					}
				});else{message.channel.send("Word not found!");}
			});
		}
	},
};