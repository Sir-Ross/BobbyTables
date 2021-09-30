const {prefix,token}=require('../config.json');
let im = require("gm").subClass({imageMagick: true});
let fs = require("fs");
const font = "Noto-Sans-UI-Regular";
let commandHandlers = {};
var Discord = require('discord.js');
const tmp = require("tmp");

function sendImage(text, imgMeta, channel) {
			let tmpDir     = "images/tmp/";
			let template   = `images/${imgMeta.template}` ;
			let font       = `images/fonts/${imgMeta.font}`;
			let pointSize  = imgMeta.pointSize;
			let size       = imgMeta.size;
			let offset     = imgMeta.offset;
			let align      = imgMeta.align;
			let background = imgMeta.bgColor;
			let fill       = imgMeta.fgColor;

			// generate random filename in the tmp/ directory
			var tempFile = tmp.fileSync({ dir: tmpDir });

			try {
				let imCmd = "convert";
				let imArgs = [template, "-background", background, "-fill", fill, "-font", font, "-pointsize", pointSize, "-gravity", align, "-size", size, `caption:${text}`, "-geometry", offset, "-gravity", "northwest", "-composite", tempFile.name]

				// if this is the dril template, use different imagemagick arguments
				if (imgMeta.template === "dril") {
					let templateTop    = "images/dril_top.png";
					let templateBottom = "images/dril_bottom.png";
					imArgs = [templateTop, "-background", background, "-fill", fill, "-font", font, "-pointsize", pointSize, "-size", size, `caption:${text}`, "-gravity", align, templateBottom, "-append", tempFile.name];
				}

				// execute imagemagick with the given arguments and get the result
				let result = spawn.sync(imCmd, imArgs);
				if (result.status !== 0) {
					// if the error code is not zero, something went wrong
					console.error("Image couldn't be generated:");
					console.error(result.output.toString("utf8"));

					// delete the temp file
					tempFile.removeCallback();
					return false;
				}

				let attachment = new Discord.Attachment(tempFile.name, "dril.png");

				channel.send("", attachment)
				.then(message => {
					console.log("Message sent!");

					// delete the temp file
					tempFile.removeCallback();
				})
				.catch(console.error);

				return true;
			} catch(error) {
				// delete the temp file
				tempFile.removeCallback();
			}
		}

module.exports = {
	name: 'im',
	description: 'This is literally stolen from Maren...',
	active: true,
	args: true,
	usage: `\`${prefix}im <image> <text>\``,
	async execute(client,message, args) {
		if(!args.length){
			message.channel.send(`Usage: ${prefix}im <image> <text>`);
			return;
		}

		if(args.length > 200){
			message.channel.send(`Too long, didn't read...`);
			return;
		}

  		var command = args.splice(0,1)[0].toLowerCase(); // Remove the first word.

  		var path = 'images.json';
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

		var template;

		if(json.hasOwnProperty(command)){
			template = json[command];
		}else{
			message.channel.send("Image not found!");
			return;
		}

		var text = args.join(" ");

		return sendImage(text,template,message.channel);
		
		// var attachment = new Discord.MessageAttachment((im("images/"+template.file)
		//   .gravity(template.align).background(template.bgcolor).stroke(template.fgcolor)
		//   .in("-size").in(template.size).font(font).out("caption:" + text).in("images/" + template.file)
		//   .out("+swap").gravity("northwest").geometry(template.offset).out("-composite")
		//   .stream(), "images/"+template.file));

		// message.channel.send("",attachment);


	},
};