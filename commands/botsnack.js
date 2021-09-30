const {prefix,token}=require('../config.json');
	
module.exports = {
	name: 'botsnack',
	description: 'Feed Bobby a Botsnack!',
	active: true,
	usage: `\`${prefix}botsnack [<amount>]\``,
	execute(client,message, args) {

		const fs = require('fs');
		//const Keyv = require('keyv');
		const io = require('@pm2/io');
		const bs = io.metric({
			name: 'Botsnacks',
			unit: 'botsnacks',
			historic: true
		});
		// const bs = io.metric({
		// 	name: 'Botsnacks',
		// 	unit: 'botsnacks',
		// });
		/*location = 'sqlite://./models/'+message.guild.id+'-botsnackDB';
		const keyv = new Keyv(location);
		keyv.on('error', err => console.error('Keyv connection error:', err));
		// io.emit("Botsnack",parseInt(keyv.get('botsnacks')));
		bs.set(parseInt(keyv.get('botsnacks')));*/
		var buffer = fs.readFileSync('./variables.json');
		var variables = JSON.parse(buffer);
		// bs.set(variables['botsnacks']);
		// variables['birthdays']++;
		console.log(variables);
		
		var count = variables.botsnacks;

		function isInt(value) {
  			return !isNaN(value) && 
         		parseInt(Number(value)) == value && 
        	!isNaN(parseInt(value, 10));
		}

		if(args.length>0){
			console.log(args);
			if(args[0]=='reset'){
				(async() => {
					// count = parseInt(await keyv.get('botsnacks'));
					if(count==undefined){
						// await keyv.set('botsnacks',0);
						message.channel.send("Botsnacks Reset!");
						bs.set(count);
						variables['botsnacks'] = count;
						fs.writeFileSync('./variables.json',JSON.stringify(variables));
						return;
					}
					//count+=parseInt((args[0]));
					// await keyv.set('botsnacks', 0);
					bs.set(0);
					variables['botsnacks'] = 0;
					fs.writeFileSync('./variables.json',JSON.stringify(variables));
					message.channel.send("Botsnacks Reset!");
					return;
				})();
				return;
			}else if(isInt(args[0])){
				(async() => {
					//count = parseInt(await keyv.get('botsnacks'));
					if(count==undefined){
					//	await keyv.set('botsnacks',args[0]);
						bs.set(0);
						variables['botsnacks'] = 0;
						fs.writeFileSync('./variables.json',JSON.stringify(variables));
						message.channel.send("I now have "+(args[0])+" botsnack!");
						return;
					}

					count+=parseInt((args[0]));
					bs.set(count);
					variables['botsnacks'] = count;
					fs.writeFileSync('./variables.json',JSON.stringify(variables));
					//await keyv.set('botsnacks', count);
					message.channel.send("I now have "+(count)+" botsnacks!");
					return;
				})();
			}else{
				message.channel.send("Invalid Quantity of Botsnacks!");
				return;
			}
		}else{
		//console.log(args.length);

			(async() => {
				// count = await keyv.get('botsnacks');
				if(count==undefined){
					// await keyv.set('botsnacks',1);
					bs.set(1);
					variables['botsnacks'] = 1;
					fs.writeFileSync('./variables.json',JSON.stringify(variables));
					message.channel.send("I now have 1 botsnack!");
					return;
				}
				count++;
				bs.set(count);
				variables['botsnacks'] = count;
				fs.writeFileSync('./variables.json',JSON.stringify(variables));
				//await keyv.set('botsnacks', count);
				message.channel.send("I now have "+(count)+" botsnacks!");
				return;
			})();
		}
	},
};