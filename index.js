var main 		= require('./main.js');
var util 		= require('util');

var Discord 	= require('discord.js');
var fs			= require('fs');

const express			= require('express');
const io 				= require('@pm2/io');
const {prefix,token}	= require('./config.json');
const client			= new Discord.Client();
client.commands			= new Discord.Collection();
const commandFiles		= fs.reddirSync('./resources/commands').filter(file=>file.endsWith('.js'));

app = express();

var instance = new main.Init(client, app);
instance.run();