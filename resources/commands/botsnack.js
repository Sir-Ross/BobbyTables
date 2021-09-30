const {prefix,token} = 	require('../../config.json');
const fs = 				require('fs');
const io =				require('@pm2/io');
const bs =				io.metric({
	name: 'Botsnacks',
	unit: 'botsnacks',
	historic: true
});

module.exports = {
	name: 			'botsnack',
	description: 	'Give a bot a snack!',
	active: 		true,
	usage: 			`\`${prefix}botsnack [<amount>]\``,
	execute(client,message,args){
		var buffer = 	fs.readFileSync('../data/variables.json');
		var variables = JSON.parse(buffer);

		var count =		variables.botsnacks;

		function isInt(value){
			return !isNaN(value) &&
			 parseInt(Number(value)) == value &&
			 !isNaN(parseInt(value,10)); 
		}

		if(args.length>0){
			if(args[0]=='reset'){
				(async()=>{
					if(count==undefined){
						message.channel.send("Botsnacks Reset!");
						bs.set(count);
						variables['botsnacks'] = count;
						fs.writeFileSync('../data/variables.json',JSON.stringify(variables));
						return;
					}
					bs.set(0);
					variables['botsnacks'] = 0;
					fs.writeFileSync('../data/variables.json',JSON.stringify(variables));
					return;
				})();
				return;
			}else if(isInt(args[0])){
				(async()=>{
					if(count==undefined){
						bs.set(0);
						variables['botsnacks'] = 0;
						fs.writeFileSync('../data/variables.json',JSON.stringify(variables));
						message.channel.send("I now have "+(args[0])+" botsnack!");
						return;
					}
					count+=parseInt((args[0]));
					bs.set(count);
					variables['botsnacks'] = count;
					fs.writeFileSync('../data/variables.json',JSON.stringify(variables));
					message.channel.send("I now have "+count+" botsnacks!");
					return;
				})();
			}else{
				message.channel.send("Invalid Quantity of Botsnacks!");
				return;
			}
		}else{
			(async()=>{
				if(count==undefined){
					bs.set(1);
					variables['botsnacks'] = 1;
					fs.writeFileSync('../data/variables.json',JSON.stringify(variables));
					message.channel.send("I now have 1 botsnack!");
					return;
				}
				count++;
				bs.set(count);
				variables['botsnacks'] = count;
				fs.writeFileSync('../data/variables.json',JSON.stringify(variables));
				message.channel.send("I now have "+count+" botsnacks!");
				return;
			})();
		}
	},
};