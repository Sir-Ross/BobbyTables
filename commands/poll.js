module.exports = {
	name: 'poll',
	description: 'Create a poll in #petitions',
	active: true,
	args: true,
	usage: '`!poll <subject>`',
	execute(client,message, args) {
		// Channel ID: 749467873491157062

		//Delete message and recreate with embed

		if((message.guild.channels.cache.find(c=>c.name.toLowerCase()===("petitions")))){
			chan = message.guild.channels.cache.find(c=>c.name.toLowerCase()==="petitions");
			var date = new Date();
			var timestamp = date.getTime();
			var embed = {
			  "embed": {
			    "title": "Poll",
			    "description": args.join(" "),
			    "color": 14601745,
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