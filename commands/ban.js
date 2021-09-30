module.exports = {
	name: 'ban',
	arg: true,
	description: 'Bans a user from Bobby',
	active: true,
	usage: '`!ban <@user>`',
	async execute(client,message, args) {
		const { prefix, token } = require('../config.json');
		if(message.author.id != '145605139070320640'){
			message.channel.send("You do not have permission to use this command!");
			return;
		}

		var fs = require('fs');
		path = 'bans.json';

		function readFileAsync(path){
			return new Promise(function(resolve, reject) {
				fs.readFile(path, function(err,data){
					if(err!==null)reject(err);
					else resolve(data);
				});
			});
		}

		const data = await readFileAsync(path);
		var json = JSON.parse(data);


		if(!args.length){
			//list bans
			var out = "Banned Users: ";
			json.banned.forEach(b=>{
				out+= client.users.cache.get(b.replace("@","").replace("!","").replace("<","").replace(">","")).username;
				out+= ", ";
			});
			// out+="\n";
			// out.replace(", \n","");
			message.channel.send((out+"\n").replace(', \n',''));
			return;
		}else{
			if(json.banned.indexOf(args[0])==-1){
				json.banned.push(args[0]);
				fs.writeFile(path,JSON.stringify(json),function (err) {
			    	if (err) throw err;
				});
				message.channel.send("User Banned From Bobby Tables");
				return;
			}else{
				message.channel.send("User Already Banned");
			}
		}
	},
};