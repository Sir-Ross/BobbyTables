var util = require('util');

var Discord = require('discord.js');
var fs = require('fs');

//const ytdl = require('ytdl-core');

var net = require('net');

port = 2133;

var startTime;

var schedule = require('node-schedule');
const cron = require("cron");

const io = require('@pm2/io');

const client = new Discord.Client({partials: ['MESSAGE','CHANNEL','REACTION']});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


const {prefix,token}=require('./config.json');

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


function Init( app){
	// client = client;
	this.app = app;
}

module.exports.Base = Base;

util.inherits(Init,Base);

var rule = new schedule.RecurrenceRule();
rule.hour = 20;
rule.minute = 0;
rule.second = 0;

var Chess = require('chess.js').Chess;
const Engine = require('node-uci').Engine;
const stockfish = new Engine('./stockfish-11-win/Windows/stockfish_20011801_x64_modern.exe');
stockfish.init();
stockfish.setoption('MultiPV',3);
const ytdl = require('ytdl-core');

		const queue = new Map();

var games = 0;
var chesses = {};
var chessmsg = {};
var thinking = {};
var MOVETIME = 300;
var SIDENAMES = {w:'Black', b:'White'};


// const _path = require('path');
// const {NodeSSH} = require('node-ssh');

// const ssh = new NodeSSH();

// ssh.connect({
// 	host: 's7.arcator.co.uk',
// 	username: 'mcsa',
// 	privateKey: '/mnt/c/Users/leonar3/AppData/Local/Packages/CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc/LocalState/rootfs/home/leonar3/.ssh/id_ed25519'
// });

Init.prototype.run = function(){
	for(const file of commandFiles){
		const command = require(`./commands/${file}`);
		client.commands.set(command.name,command);
	}

	const file = new Discord.MessageAttachment('birthday.mov');

	function strip(s){
		return s.replace(/^\s+|\s+$/g,'');
	}

	function get_fen(id) {
    	return 'http://www.fen-to-image.com/image/20/single/coords/' + chesses[id].fen().split(' ')[0];
	}

	function end_game(id, resign, quiet) {
	    if(chesses[id] === undefined) return;
	    games--;
	    chessCount.set(games);
	    if(!quiet) {
	        var winner;
	        if(resign) {
	            winner = SIDENAMES[chesses[id].turn()] + ' wins by resignation!';
	        } else if(chesses[id].in_checkmate()) {
	            winner = SIDENAMES[chesses[id].turn()] + ' wins by checkmate!';
	        } else if(chesses[id].in_stalemate()) {
	            winner = 'Draw by stalemate!';
	        } else if(chesses[id].in_threefold_repetition()) {
	            winner = 'Draw by threefold repetition!';
	        } else if(chesses[id].insufficient_material()) {
	            winner = 'Draw by insufficient material!';
	        } else if(chesses[id].in_draw()) {
	            winner = 'Draw!';
	        }
	        const replyEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setDescription('Game Over! ',winner)
				.addFields({name: "Moves", value: (chesses[id].pgn({newline_char: '\n'}))})
				.setImage(get_fen(id));
			chessmsg[id].channel.send(replyEmbed);
	    }
	    console.log('Chess game end: ', chessmsg[id].author.username, chessmsg[id].channel.name);
	    delete chesses[id];
	    delete thinking[id];
	}

	client.once('ready', () => {
		console.log('Ready');
		startTime = Date.now();
		let playing = client.voice.connections.size; 
		client.guilds.cache.each(guild => servers.inc());
	});

	var lastPinTime = 0;

	client.on('messageReactionAdd', async (reaction,user) => {
		if(reaction.partial){
			try{
				await reaction.fetch();
			}catch{
				return;
			}
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
					// .setDescription(reaction.message.content)
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: reaction.message.content}
					)
					// .setAuthor(reaction.message.author.username)
					.setTimestamp(Date.now())
					//.setFooter("Pinned by "+user.username);
				chan.send(embed);}catch(e){console.log(e);
				embed.setTitle("🔗")
					// .setDescription(reaction.message.content)
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: "*Attatchment*"}
					)
					// .setAuthor(reaction.message.author.username)
					.setTimestamp(Date.now())
					//.setFooter("Pinned by "+user.username);
				chan.send(embed);}
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
					// .setDescription(reaction.message.content)
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: output}
					)
					// .setAuthor(reaction.message.author.username)
					.setTimestamp(Date.now())
					//.setFooter("Pinned by "+user.username);
				chan.send(embed);}catch(e){console.log(e);
				embed.setTitle("🔗")
					// .setDescription(reaction.message.content)
					.setURL(reaction.message.url)
					.setAuthor("Pinned by "+user.username)
					.addFields(
						{ name: reaction.message.author.username, value: "*Attatchment*"}
					)
					// .setAuthor(reaction.message.author.username)
					.setTimestamp(Date.now())
					//.setFooter("Pinned by "+user.username);
				chan.send(embed);}
				try{

					reaction.message.attachments.array().forEach(function(attch){
						
						if(attch.name.endsWith(".png"))
						outatt = attch;
						outatt.spoiler = true;

						chan.send(outatt);
					});
					//reaction.message.attachments.array());
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
		const banned = await readFileAsync('./bans.json');
		var bnd = JSON.parse(banned);


		var usermention = "<@!"+message.author.id+">";
		if(bnd.banned.indexOf(usermention)!=-1){
			return;
		}

		// if(message.content.toLowerCase().startsWith("no u")&&message.author.id!='739158153970581584'){
		// 	message.channel.send('no u');
		// 	return;
		// }



/*		const serverQueue = queue.get(message.guild.id);
		if(message.content.startsWith(`${prefix}play`)){
			execute_(message, serverQueue);
			return;
		}else if(message.content.startsWith(`${prefix}skip`)){
			skip(message, serverQueue);
			return;
		}else if(message.content.startsWith(`${prefix}stop`)){
			stop(message, serverQueue);
			return;
		}
*/		

		var buffer = fs.readFileSync('./variables.json');
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
				var buffer = fs.readFileSync('./variables.json');
				var variables = JSON.parse(buffer);
				variables['yeahs']++;
				yeahs.set(variables['yeahs']);
				fs.writeFileSync('./variables.json',JSON.stringify(variables));
			}
			if (!message.content.startsWith(prefix) || message.author.bot) return;


			var msg = strip(message.content);
			var umsg = msg.toLowerCase();
			//console.log(umsg);
			if(umsg.indexOf('chess')===1){
				var id = message.author.id+'!?#'+message.channel.id;
				chessmsg[id]=message;
				if(chesses[id] === undefined){
					chesses[id] = new Chess();
					games++;
					chessCount.set(games);
					console.log('Chess game: ', message.author.username, message.channel.name);
                	thinking[id] = false;
				}
				var move = strip(msg.substring('chess'.length+1));
				if(move === 'resign'){
					end_game(id,true,false);
					return;
				}
				if(thinking[id] === true){
					client.reply(chessmsg[id], "I'm still thinking...");
					return;
				}
				if(move !== 'skip' && chesses[id].move(move,{sloppy:true})===null){
					const replyEmbed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.setDescription('Illegal move!')
						.addFields({name: "Valid Moves:", value: (chesses[id].moves().join(', '))})
						.setImage(get_fen(id));
					chessmsg[id].channel.send(replyEmbed);
					return;
				}
				const chain = stockfish.chain()
					.position(chesses[id].fen())
					.go({depth:5})
					.then(function(result){
						var match = result.bestmove.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/);
						if(match){
							var m = chesses[id].move({from: match[1], to:match[2], promotion: match[3]});
							const replyEmbed = new Discord.MessageEmbed()
								.setColor('#0099ff')
								.setDescription(m.san)
								.setImage(get_fen(id));
							chessmsg[id].channel.send(replyEmbed);
							thinking[id] = false;
							if(chesses[id].game_over()){
								end_game(id, false, false);
							}
						}
					});
				thinking[id]=true;
				if(chesses[id].game_over()){
					end_game(id,false,false);
				}
			}

			const args = message.content.slice(prefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();

			// if(commandName === "play"){
			// 	client.player.play(message,args[0],message.member.user);
			// }

			if(!client.commands.has(commandName)) return;

			const command = client.commands.get(commandName);

			if (command.args && !args.length){
				return message.channel.send(`Insufficient Arguments!`);
			}

			try{
				var buffer = fs.readFileSync('./variables.json');
				var variables = JSON.parse(buffer);
				commandCalls.set(variables['commandCalls']+1);
				variables['commandCalls']++;
				fs.writeFileSync('./variables.json',JSON.stringify(variables));
				command.execute(client,message,args);
				// a=true;
			}catch(error){
				console.error(error);
				message.reply('Command Failed To Execute');
			}
		});
	});
/*async function execute_(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You ain't even listening!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Ain't got perms :("
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title}queued!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You ain't even listening!"
    );
  if (!serverQueue)
    return message.channel.send("Ain't nothing to skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You ain't even listening!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}*/

	client.login(token);

	function hbd(){const embedMessage = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Happy Birthday,')
			.setDescription('One of these days will be the right day!')
			.setThumbnail('https://cdn.discordapp.com/attachments/700229676815089698/700444715392303124/res.png')
			.setFooter('hopefully one of these days I\'ll be right.','https://media.discordapp.net/attachments/700229676815089698/700435343681519616/ootdibr.png');
		client.channels.cache.get('694393857638662144').send({files: [file], embed: embedMessage});
		//birthdays.inc();
		var buffer = fs.readFileSync('./variables.json');
		var variables = JSON.parse(buffer);
		birthdays.set(variables['birthdays']+1);
		variables['birthdays']++;
		fs.writeFileSync('./variables.json',JSON.stringify(variables));
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