const {prefix,token}=require('../config.json');

module.exports = {
	name: 'preach',
	description: 'Spit some knowledge!',
	active: true,
	usage: `\`${prefix}preach [<topic>]\`\nFor list of topics \`${prefix}preach topics\``,
	async execute(client,message, args) {
		// message.channel.send('Pong!');

		var fs = require('fs');
		path = 'quotes/';
		var files = fs.readdirSync(path);
		console.log(files);
		
		function readFileAsync(path){
			return new Promise(function(resolve, reject) {
				fs.readFile(path, function(err,data){
					if(err!==null)reject(err);
					else resolve(data);
				});
			});
		}

		var quotes = [];
		var authors = [];
		for(i=0;i<files.length;i++){
			const data = await readFileAsync(path+files[i]);
			var json = JSON.parse(data);
			if(args.length){
				if(json.topic.includes(args[0])){
					json.quotes.forEach(q =>{
						quotes.push(q);
						authors.push(json.author);
					});
				}
			}else{
				json.quotes.forEach(q =>{
					quotes.push(q);
					authors.push(json.author);
				});
			}
		}
		r = Math.floor(Math.random() * (quotes.length));
		console.log(authors[r]);
		console.log(r);
		var color = "";
		switch(Math.floor(Math.random()*Math.floor(4))){
			case 0:
				color = "bash";
				break;
			case 1:
				color = "fix";
				break;
			case 2:
				color = "css";
				break;
			case 3:
				color = "";
				break;
		}
		message.channel.send("```"+color+"\n\""+quotes[r]+"\"\n—"+authors[r]+"```");
	},
};