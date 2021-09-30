module.exports = {

	name: 'mail',
	description: 'A system of collecting, sending, and receiving mail',
	active: true,
	usage: 'Type `!mail help` for list of commands',
	async execute(client,message, args) {
		// const Keyv = require('keyv');
		// location = 'sqlite://./models/mailboxDB';
		// const keyv = new Keyv('sqlite://./models/mailboxDB',{ serialize: JSON.stringify, deserialize: JSON.parse });
		// keyv.on('error', err => console.error('Keyv connection error:', err));
		//location = 'sqlite://./models/mailboxes/'+message.author.id+'-mailboxDB';

		//const keyv = new Keyv(location);
/*
		function keyvSend(address, author, letter){
			(async () =>{
				read = await keyv.get(address);
				if(read===undefined){
					//define with info
					mb = {
						user_id: address,
						mailbox: [letter],
						senders: [author],
						status:  ['0'],
					};
					await keyv.set(address,(mb));
				}else{
					mb = read;
					mb.mailbox.push(letter);
					mb.senders.push(author);
					mb.status.push('0');
					await keyv.set(address,(mb));
				}
				message.author.send("Mail Sent!");
			})();
		}

		function keyvCheck(address){
			(async () =>{
				location = 'sqlite://./models/mailboxDB';
				if(await keyv.get(address)===undefined){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
				}else{
					mb = await keyv.get(address);
					outText = "Your Inbox:\n";
					for(i = 0; i<mb.mailbox.length;i++){
						if(mb.status[i]==='0')outText+="**";
						outText+=i+1;
						outText+=". From\t\"";
						var name;
						var val;
						var out = await client.users.fetch(mb.senders[i]);
						client.users.fetch(mb.senders[i]).then((name)=>{
							val = name.username;
							return (name);
						});
						outText+=out.username;
						outText+="\"";
						if(mb.status[i]==='0')outText+="**";
						outText+='\n';
					}
					message.author.send(outText);
					return;
				}
			})();
		}

		function keyvRead(address,index){
			(async () =>{
				location = 'sqlite://./models/mailboxDB';
				if(await keyv.get(address)===undefined){
					message.author.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
				}else{
					mb = await keyv.get(address);
					if(index<=0||index>mb.status.length){
							message.author.send("Index out of bounds!");
							return;
						}else{
							mb.status[index-1]='1';
							var out = await client.users.fetch(mb.senders[index-1]);
							client.users.fetch(mb.senders[index-1]).then((name)=>{
								//console.log("name.username(inside): "+name.username);
								val = name.username;
								return (name);
							});

							await keyv.set(address,mb);
							message.author.send("\n**From:** "+out.username+"\n**To:** "+message.author.username+"\n**Body:**\n"+mb.mailbox[index-1]);
						}
					return;
				}
			})();
		}

		function keyvDelete(address){
			(async () =>{
				location = 'sqlite://./models/mailboxDB';
				if(await keyv.get(address)===undefined){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
				}else{
					mb = await keyv.get(address);
					if(args[1]<=0||args[1]>mb.status.length){
							message.author.send("Index out of bounds!");
							return;
						}else{
							mb.status.splice(args[1]-1,1);
							mb.senders.splice(args[1]-1,1);
							mb.mailbox.splice(args[1]-1,1);
							message.author.send("Message deleted!");

							await keyv.set(address,mb);
						}
					return;
				}
			})();
		}

		function keyvMark(address,value){
			(async () =>{
				location = 'sqlite://./models/mailboxDB';
				if(await keyv.get(address)===undefined){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
				}else{
					mb = await keyv.get(address);
					if(args[1]<=0||args[1]>mb.status.length){
							message.author.send("Index out of bounds!");
							return;
						}else{
							mb.status[args[1]-1]=value;
							// mb.senders.splice(args[1]-1,1);
							// mb.mailbox.splice(args[1]-1,1);
							// message.channel.send("Message deleted!");
							if(value==='0')message.author.send("Marked Unread!");
							else message.author.send("Marked Read!");
							await keyv.set(address,mb);
						}
					return;
				}
			})();
		}

		function keyvForward(address,index){
			(async () =>{
				if(await keyv.get(message.author.id)===undefined){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
				}else{
					mb = await keyv.get(message.author.id);
					bm = await keyv.get(address);
					if(index>mb.senders.length||index<=0){
						message.author.send("Index out of bounds!");
						return;
					}
					//console.log(mb);
					var out = await client.users.fetch(mb.senders[index-1]);
					client.users.fetch(mb.senders[index-1]).then((name)=>{
						//console.log("name.username(inside): "+name.username);
						val = name.username;
						return (name);
					});
					output = ("\n`From: "+(out.username)+"\nTo: "+(message.author.username)+"\nBody: "+mb.mailbox[index-1]+"`");

					if(bm===undefined){
						nmb = {
							user_id: address,
							mailbox: [output],
							senders: [message.author.id],
							status:  ['0'],
						};
						await keyv.set(address,nmb);
						message.author.send("Mail Forwarded!");
						return;
					}else{
						bm.mailbox.push(output);
						bm.senders.push(message.author.id);
						bm.status.push('0');
						await keyv.set(address,bm);
						message.author.send("Mail Forwarded!");
						return;
					}
				}
			})();
		}*/

		const fs = require('fs');
		var path;
		if(!args.length){
			//No Arguments
			message.channel.send("Type `!mail help` for a full list of commands!");
			return 0;
		}
		
		switch(args[0]){
			case "help":
				message.channel.send("`!mail help` - Displays this message\n"+
					"`!mail send <@User> <Message>` - Sends a message to mentioned user\n"+
					"`!mail check` - Displays a list of mail in your inbox alongside index numbers\n"+
					"`!mail read <index>` - Displays mail at the indicated index\n"+
					"`!mail delete <index>` - Deletes mail at the indicated index\n"+
					"`!mail markRead <index>` - Marks the mail at the indicated index as read\n"+
					"`!mail markUnread <index>` - Marks the mail at the indicated index as unread\n"+
					"`!mail forward <index> <@User>` - Forwards the mail at the indicated index to mentioned user");
				break;
			case "send":
				// Send Mail
				if(args.length<3){
					message.channel.send('Invalid Arguments: !mail send <recipient_id> <message>');
				}else{
					letter = "";
					spaces = 0;
					for(i = 0; i<message.content.length;i++){
						if(spaces<3){
							if(message.content[i]===' '){
								spaces++;
							}
							continue;
						}else{
							letter+=message.content[i];
						}
					}
					
					const fs = require('fs');
					path = 'mail/';
					var w = args[1].replace("<@","");
					w=w.replace("!","");
					w=w.replace(">","");
					path+=w;
					//path+=args[1].substring(3,21);
					sender = message.author.id;
					path+='.json';

					//console.log(path);
					//data;
					// keyvSend(w,message.author.id,letter);
					if(!fs.existsSync(path)){
						user = {
							user_id: w,
							//username: message.author.username,
							mailbox: [letter],
							senders: [sender],
							//status:  { 0 },
							status: ['0'],
						};
						data = JSON.stringify(user);
						fs.writeFileSync(path,data);
					}else{
						var recipient;
						fs.readFile(path,(err,data) =>{
							if(err) throw err;
							recipient=JSON.parse(data);
							//console.log(recipient);
							recipient.mailbox.push(letter);
							recipient.senders.push(message.author.id);
							recipient.status.push('0');
							//console.log(recipient);

							fs.writeFileSync(path,JSON.stringify(recipient));
						});
					}
				}
				break;
			case "check":
				// Check Inbox
				const fs = require('fs');
				path = 'mail/';
				path+=message.author.id;
				// sender = message.author.id;
				path+='.json';
				// keyvCheck(message.author.id);
				if(!fs.existsSync(path)){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
					//break;
				}else{
					//var recipient;
					function readFileAsync(path){
						return new Promise(function(resolve, reject) {
							fs.readFile(path, function(err,data1){
								if(err!==null)reject(err);
								else resolve(data1);
							});
						});
					}
					const data1 = await readFileAsync(path); const recipient = JSON.parse(data1);
						//if(err) throw err;
						//recipient=JSON.parse(data);
						if(!recipient.senders.length){
							message.channel.send("Mailbox is empty!");
							return;
							//break;
						}else{
						outText = "Your Inbox:\n";
						for(i = 0; i<recipient.senders.length;i++){
							if(recipient.status[i]==='0')outText+="**";
							outText+=i+1;
							outText+=". From\t\"";
							//console.log("Promise: ",client.users.fetch(recipient.senders[i]));
							var name;
							var val;
							var out = await client.users.fetch(recipient.senders[i]);
							client.users.fetch(recipient.senders[i]).then((name)=>{
								//console.log("name.username(inside): "+name.username);
								val = name.username;
								return (name);
							});
							//console.log("name(outside): ",name);
							//console.log("out: ",out);
							//console.log("out.username: ",out.username);
							//console.log("val: ",val);
							/*  name.username is undefined */
							//console.log("name.username(outside): "+name.username); 
							// esc = returnVal();
							outText+=out.username;
							outText+="\"";
							if(recipient.status[i]==='0')outText+="**";
							outText+='\n';
						}
						message.channel.send(outText);
						}
					
				}
				break;
			case "read":
				// Read Mail
				const fs2 = require('fs');
				path = 'mail/';
				path+=message.author.id;
				// sender = message.author.id;
				path+='.json';
				// keyvRead(message.author.id,args[1]);
				if(!fs2.existsSync(path)){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
					//break;
				}else{
					function readFileAsync(path){
						return new Promise(function(resolve, reject) {
							fs2.readFile(path, function(err,data2){
								if(err!==null)reject(err);
								else resolve(data2);
							});
						});
					}
					const data2 = await readFileAsync(path); const recipient = JSON.parse(data2);
					if(!recipient.status.length){
						message.channel.send("Mailbox is empty!");
						return;
					}else{
						if(args[1]<=0||args[1]>recipient.status.length){
							message.channel.send("Index out of bounds!");
							return;
						}else{
							recipient.status[args[1]-1]='1';
							var out = await client.users.fetch(recipient.senders[args[1]-1]);
							client.users.fetch(recipient.senders[args[1]-1]).then((name)=>{
								//console.log("name.username(inside): "+name.username);
								val = name.username;
								return (name);
							});
							message.channel.send("\n**From:** "+out.username+"\n**To:** "+message.author.username+"\n**Body:**\n"+recipient.mailbox[args[1]-1]);

							fs2.writeFileSync(path,JSON.stringify(recipient));
						}
					}
				}
				break;
			case "delete":
				// Delete Mail
				const fs3 = require('fs');
				path = 'mail/';
				path+=message.author.id;
				// sender = message.author.id;
				path+='.json';
				keyvDelete(message.author.id);
				if(!fs3.existsSync(path)){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
					//break;
				}else{
					function readFileAsync(path){
						return new Promise(function(resolve, reject) {
							fs3.readFile(path, function(err,data3){
								if(err!==null)reject(err);
								else resolve(data3);
							});
						});
					}
					const data3 = await readFileAsync(path); const recipient2 = JSON.parse(data3);
					if(!recipient2.status.length){
						message.channel.send("Mailbox is empty!");
						return;
					}else{
						if(args[1]<=0||args[1]>recipient2.status.length){
							message.channel.send("Index out of bounds!");
							return;
						}else{
							recipient2.status.splice(args[1]-1,1);
							recipient2.senders.splice(args[1]-1,1);
							recipient2.mailbox.splice(args[1]-1,1);
							message.channel.send("Message deleted!");
							fs3.writeFileSync(path,JSON.stringify(recipient2));
							return;
						}
					}
				}
				break;
			case "markRead":
				// Mark a Message as Read
				const fs4 = require('fs');
				path = 'mail/';
				path+=message.author.id;
				// sender = message.author.id;
				path+='.json';
				// keyvMark(message.author.id,'1');
				if(!fs4.existsSync(path)){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					return;
					//break;
				}else{
					function readFileAsync(path){
						return new Promise(function(resolve, reject) {
							fs4.readFile(path, function(err,data4){
								if(err!==null)reject(err);
								else resolve(data4);
							});
						});
					}
					const data4 = await readFileAsync(path); const recipient4 = JSON.parse(data4);
					if(!recipient4.status.length){
						message.channel.send("Mailbox is empty!");
						return;
					}else{
						if(args[1]<=0||args[1]>recipient4.status.length){
							message.channel.send("Index out of bounds!");
							return;
						}else{
							recipient4.status[args[1]-1] = '1';
							message.channel.send("Message marked as read!");
							fs4.writeFileSync(path,JSON.stringify(recipient4));
							return;
						}
					}
				}
				break;
			case "markUnread":
				// Mark a Message as Unread
				const fs5 = require('fs');
				path = 'mail/';
				path+=message.author.id;
				// sender = message.author.id;
				path+='.json';
				// keyvMark(message.author.id,'0');
				if(!fs5.existsSync(path)){
					message.channel.send("Mailbox does not yet exist! You need to receive mail first!");
					break;
					//break;
				}else{
					function readFileAsync(path){
						return new Promise(function(resolve, reject) {
							fs5.readFile(path, function(err,data5){
								if(err!==null)reject(err);
								else resolve(data5);
							});
						});
					}
					const data5 = await readFileAsync(path); const recipient5 = JSON.parse(data5);
					if(!recipient5.status.length){
						message.channel.send("Mailbox is empty!");
						break;
					}else{
						if(args[1]<=0||args[1]>recipient5.status.length){
							message.channel.send("Index out of bounds!");
							break;
						}else{
							recipient5.status[args[1]-1] = '0';
							message.channel.send("Message marked as unread!");
							fs5.writeFileSync(path,JSON.stringify(recipient5));
							break;
						}
					}
				}
				break;
			case "forward":
				// // Forward a message
				// if(args.length<3){
				// 	message.channel.send("Invalid Arguments: `!mail forward <mail index> <recipient>");
				// 	return;
				// }
				// //console.log(args);
				// rc = args[2].replace("<","").replace(">","").replace("!","").replace("@","");
				// keyvForward(rc,args[1]);
				const fss = require('fs');
				const fss2 = require('fs');
				path='mail/';
				var who = args[2].replace('<@','');
				who=who.replace('!','');
				who=who.replace('>','');
				path+=who;
				path+='.json';
				path2='mail/';
				var who2 = message.author.id.replace('<@','');
				who2=who2.replace('!','');
				who2=who2.replace('>','');
				path2+=who2;
				path2+='.json';
				if(!fss.existsSync(path)){
					user = {
						user_id: who,
						//username: message.author.username,
						mailbox: [],
						senders: [],
						//status:  { 0 },
						status: [],
					};
					data7 = JSON.stringify(user);
					fss.writeFileSync(path,data7);
				}
				function readFileAsync(path){
					return new Promise(function(resolve, reject) {
						fss.readFile(path, function(err,data6){
							if(err!==null)reject(err);
							else resolve(data6);
						});
					});
				}
				function readFileAsync(path2){
					return new Promise(function(resolve, reject) {
						fss2.readFile(path2, function(err,data62){
							if(err!==null)reject(err);
							else resolve(data62);
						});
					});
				}
				const data6 = await readFileAsync(path); const recipient6 = JSON.parse(data6);
				const data62 = await readFileAsync(path2); const recipient62 = JSON.parse(data62);
				if(args[1]<=0||args[1]>recipient62.status.length){
					message.channel.send("Index out of bounds!");
					return;
				}else{
					var out;
					out = await client.users.fetch(recipient62.senders[args[1]-1]);
					client.users.fetch(recipient62.senders[args[1]-1]).then((name)=>{
						//console.log("name.username(inside): "+name.username);
						val = name.username;
						return (name);
					});
				
					newMessage = "\n*From:* "+out.username+"\n*To:* "+message.author.username+"\n*Body:*\n"+recipient62.mailbox[args[1]-1];
					if(!fss.existsSync(path)){
						user = {
							user_id: who,
							//username: message.author.username,
							mailbox: [newMessage],
							senders: [message.author.id],
							//status:  { 0 },
							status: ['0'],
						};
						data6 = JSON.stringify(user);
						fss.writeFileSync(path,data6);
						break;
					}else{
						recipient6.mailbox.push(newMessage);
						recipient6.senders.push(message.author.id);
						recipient6.status.push('0');
						//console.log(recipient6);

						fss.writeFileSync(path,JSON.stringify(recipient6));
						break;
					}
				}
				break;
		}
	},
};