var util 			= require('util');
var Discord			= require('discord.js');
var fs				= require('fs');

var net				= require('net');
port				= 2133;

var startTime;
var schedule		= require('node-schedule');
const cron			= require("cron");

const io			= require('@pm2/io');

const client 		= new Discord.Client({partials: ['MESSAGE','CHANNEL','REACTION']});
client.commands 	= new Discord.Collection();

const commandFiles	= fs.readdirSync('./resources/commands').filter(file => file.endsWith('.js'));

const {prefix,token}= require('./config.json');

/* PM2 Custom Metrics */
	const servers = io.counter({
		name: 'Servers',
		id: 'app/servers'
	});

	const birthdays = io.metric({
		name: 'Birthdays Wished',
		historic: true
	});

	const commandCalls = io.metric({
		name: 'Commands Run',
		historic: true
	});

	const yeahs = io.metric({
		name: 'Yeahs',
		historic: true
	});

	const chessCount = io.metric({
		name: 'Chess',
		unit: 'games'
	});
/* End of Custom Metrics */

function Base(base){
	this.base = base;
}

Base.prototype.__defineSetter__('type',function(type){
	Object.defineProperty(this, 'constructor', {
		value: module.exports[type],
		enumarable: false
	});
	this.__proto__=module.exports[type].prototype;
});

function Init(app){
	this.app = app;
}

module.exports.Base = Base;
util.inherits(Init,Base);

var rule 		= new schedule.RecurrenceRule();
rule.hour		= 20;
rule.minute		= 0;
rule.second		= 0;

Init.prototype.run = function(){
	for(const file of commandFiles){
		const command = require(`./resources/commands/${file}`);
		client.commands.set(command.name,command);
	}

	const bday_mov = new Discord.MessageAttachment('resources/birthday.mov');

	function strip(s){
		return s.replace(/^\s+|\s+$/g,'');
	}

	client.once('ready', () => {
		console.log('Ready');
		startTime = Date.now();
		client.guilds.cache.each(guild => servers.inc());
	});

	var lastPinTime	= 0;

	client.on('messageReactionAdd', async (reaction,user) => {
		if(reaction.partial){
			try{await reaction.fetch();}
			catch{return;}
		}

		if(reaction.emoji.name === '📌'){
			if(reaction.message.reactions.cache.get('📌').me){
				return;
			}else{
				reaction.message.react('📌');
				chan = reaction.message.guild.channels.cache.find(c=>c.id==="747978635952259204");
				var link = "[Link to Message]("+reaction.message.url+")";
				var embed = new Discord.MessageEmbed();
				try{embed.setTitle("🔗")
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: reaction.message.content}
					)
					.setTimestamp(Date.now())

					chan.send(embed);
				}catch(e){console.log(e);
				embed.setTitle("🔗")
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: "*Attatchment*"}
					)
					.setTimestamp(Date.now())
					chan.send(embed);
				}
				try{chan.send(reaction.message.attachments.array());}catch(e){console.log(e);};
				return;
			}
		}
		if(reaction.emoji.name === '📍'){
			if(reaction.message.reactions.cache.get('📍').me){
				return;
			}else{
				reaction.message.react('📍');
				chan = reaction.message.guild.channels.cache.find(c=>c.id==="747978635952259204");
				var link = "[Link to Message]("+reaction.message.url+")";
				var embed = new Discord.MessageEmbed();
						console.log(reaction.message.attachments.array());
				if(reaction.message.content !=""){output = "||"+reaction.message.content+"||";}else{output = reaction.message.content;}
				try{embed.setTitle("🔗")
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: output}
					)
					.setTimestamp(Date.now())
				chan.send(embed);}catch(e){console.log(e);
				embed.setTitle("🔗")
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: "*Attatchment*"}
					)
					.setTimestamp(Date.now())
				chan.send(embed);}
				try{
					reaction.message.attachments.array().forEach(function(attch){	
						if(attch.name.endsWith(".png"))
						outatt = attch;
						outatt.spoiler = true;
						chan.send(outatt);
					});
					}catch(e){console.log(e);};
				return;
			}
		}
	});

	client.on('message', async message =>{
		function readFileAsync(path){
			return new Promise(function(resolve, reject) {
				fs.readFile(path, function(err,data){
					if(err!==null)reject(err);
					else resolve(data);
				});
			});
		}

		const banned 	= await readFileAsync('./data/bans.json');
		var bnd 		= JSON.parse(banned);

		var usermention	= "<@!"+message.author.id+">";
		if(bnd.banned.indexOf(usermention)!=-1){
			return;
		}

		var buffer		= fs.readFileSync('./data/variables.json');
		var variables = JSON.parse(buffer);
		birthdays.set(variables['birthdays']);
		commandCalls.set(variables['commandCalls']);
		yeahs.set(variables['yeahs']);
		var date = new Date();
		var timestamp = date.getTime();

		message.channel.fetch().then((d) =>{
			if(message.channel === message.guild.channels.cache.find(c=>c.name.toLowerCase()==="petitions")){
				message.react(':upvote:639227843758391306');
            	message.react(':downvote:639227835130707978');

			}
			console.log('#'+d.name+':'+message.author.username.padEnd(20)," ",message.content);
			if(message.content.includes('yeah')){
				var buffer = fs.readFileSync('./data/variables.json');
				var variables = JSON.parse(buffer);
				variables['yeahs']++;
				yeahs.set(variables['yeahs']);
				fs.writeFileSync('./data/variables.json',JSON.stringify(variables));
			}
			if (!message.content.startsWith(prefix) || message.author.bot) return;

			var msg 			= strip(message.content);
			var umsg 			= msg.toLowerCase();

			const args 			= message.content.slice(prefix.length).trim().split(/ +/);
			const commandName 	= args.shift().toLowerCase();

			if(!client.commands.has(commandName)) return;

			const command 		= client.commands.get(commandName);

			if(command.args && !args.length){
					return message.channel.send(`Insufficient Arguments!`);
			}

			try{
				var buffer = fs.readFileSync('./data/variables.json');
				var variables = JSON.parse(buffer);
				commandCalls.set(variables['commandCalls']+1);
				variables['commandCalls']++;
				fs.writeFileSync('./data/variables.json',JSON.stringify(variables));
				command.execute(client,message,args);
			}catch(error){
				console.error(error);
				message.reply('Command Failed To Execute');
			}
		});
	});

	client.login(token);

	function hbd(){const embedMessage = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Happy Birthday,')
			.setDescription('One of these days will be the right day!')
			.setThumbnail('https://cdn.discordapp.com/attachments/700229676815089698/700444715392303124/res.png')
			.setFooter('hopefully one of these days I\'ll be right.','https://media.discordapp.net/attachments/700229676815089698/700435343681519616/ootdibr.png');
		client.channels.cache.get('694393857638662144').send({files: [bday_mov], embed: embedMessage});
		var buffer = fs.readFileSync('./resources/variables.json');
		var variables = JSON.parse(buffer);
		birthdays.set(variables['birthdays']+1);
		variables['birthdays']++;
		fs.writeFileSync('./resources/variables.json',JSON.stringify(variables));
	}

	function hydrate(){
		client.channels.cache.get('148831815984087041').send("Don't forget to stay hydrated!");
	}

	let job = new cron.CronJob('00 44 20 * * *',hbd);
	let hydrate1 = new cron.CronJob('00 00 14 * * *',hydrate);
	let hydrate2 = new cron.CronJob('00 00 11 * * *',hydrate);

	hydrate1.start();
	hydrate2.start();
	job.start();
};

module.exports.Init = Init;