var main = require('./main.js');
var util = require('util');

var Discord = require('discord.js');
var fs = require('fs');

const express = require('express');
const io = require('@pm2/io');
const {prefix,token}=require('./config.json');
// var wolfram = require('wolfram');
// const Wolfram = require('@william5553/wolframalpha');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const Keyv = require('keyv');



app = express();

const file = new Discord.MessageAttachment('birthday.mov');

var instance = new main.Init(client, app);
instance.run();
// instance.test();