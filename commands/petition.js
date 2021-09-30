module.exports = {
	name: 'petition',
	description: 'Create a petition in #petitions',
	active: true,
	args: true,
	usage: '`!petition <subject>`',
	execute(client,message, args) {
		// Channel ID: 749467873491157062

		//Delete message and recreate with embed

		if((message.guild.channels.cache.find(c=>c.name.toLowerCase()===("petitions")))){
			chan = message.guild.channels.cache.find(c=>c.name.toLowerCase()==="petitions");
			var date = new Date();
			var timestamp = date.getTime();
			var embed = {
			  "embed": {
			    "title": "Petition",
			    "description": args.join(" "),
			    "color": 14829126,
			    "timestamp": timestamp,
			    "author": {
			      "name": message.author.username,
			    },
			    "fields": [
			      {
			        "name": "<:upvote:639227843758391306>",
			        "value": "Yea",
			        "inline": true
			      },
			      {
			        "name": "<:downvote:639227835130707978>",
			        "value": "Ney",
			        "inline": true
			      }
			    ]
			  }
			};
			var msg = chan.send(embed);
		}
	},
};