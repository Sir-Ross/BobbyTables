/*var taggedUser = msg.mentions.users.first();
var user = args[1]
if(!args[1]) return msg.channel.send('No member was input.');
if(taggedUser == null) return msg.channel.send('Please mention the user your trying to wish.');
if(args[2]) {
    console.log(msg.content)
    var a = msg.content
    var b = a.indexOf('>', 1)
    let wish = new Discord.MessageEmbed(user)
        .setColor('#41bfb1')
        .setTitle('Happy Birthday,')
        .setDescription(':cake: '+user+' :confetti_ball: :tada: Happy birthday!')
        .setFooter('from '+msg.author.username, msg.author.displayAvatarURL())
        .setThumbnail(taggedUser.displayAvatarURL())
        .addField('Custom Message', msg.content.slice(b+1))
        taggedUser.send(wish)
        console.log('Sent birthday wish to '+taggedUser.username+' with message of "'+a.substr(b+1)+'"')
        msg.channel.send('I\'ve sent the birthday wish!')
        break;
} else {
   let wish = new Discord.MessageEmbed(user)
        .setColor('#41bfb1')
        .setTitle('Happy Birthday,')
        .setDescription(':cake: '+user+' :confetti_ball: :tada: Happy birthday!')
        .setFooter('from '+msg.author.username, msg.author.displayAvatarURL())
        .setThumbnail(taggedUser.displayAvatarURL()) 
        taggedUser.send(wish)
        msg.channel.send('I\'ve sent the birthday wish!')
        console.log('Sent birthday wish to '+taggedUser.username)
        break;
}*/
module.exports = {
    name: 'wish',
    description: 'Wish someone happy birthday. Modified original code by Vulpic',
    active: true,
    usage: '`!wish <@user>`',
    execute(client,msg, args) {
        const Discord = require('discord.js');
        var taggedUser = msg.mentions.users.first();
        var user = args[0]
        if(!args[0]) return msg.channel.send('No member was input.');
        if(taggedUser == null) return msg.channel.send('Please mention the user your trying to wish.');
        if(args[1]) {
            var a = msg.content
            var b = a.indexOf('>', 1)
            // var wish = new Discord.MessageEmbed(user)
            //     .setColor('#41bfb1')
            //     .setTitle('Happy Birthday,')
            //     .setDescription(':cake: '+user+' :confetti_ball: :tada: Happy birthday!')
            //     .setFooter('from '+msg.author.username, msg.author.displayAvatarURL())
            //     .setThumbnail(taggedUser.displayAvatarURL())
            //     .addField('Custom Message', msg.content.slice(b+1))
            var wish = {
                "embed": {
                    "title": "Happy Birthday,",
                    "description": ':cake: '+user+' :confetti_ball: :tada: Happy birthday!',
                    "color": '#41bfb1',
                    "footer": {
                        "icon_url": msg.author.displayAvatarURL(),
                        "text": 'from '+msg.author.username
                    },
                    "thumbnail": taggedUser.displayAvatarURL(),
                    "fields": [
                        {
                            "name": "Custom Message",
                            "value": msg.content.slice(b+1)
                        }
                    ]
                    
                }
            }
                taggedUser.send(wish)
                console.log('Sent birthday wish to '+taggedUser.username+' with message of "'+a.substr(b+1)+'"')
                msg.channel.send('I\'ve sent the birthday wish!')
                return;
                //break;
        } else {
           // var wish = new Discord.MessageEmbed(user)
           //      .setColor('#41bfb1')
           //      .setTitle('Happy Birthday,')
           //      .setDescription(':cake: '+user+' :confetti_ball: :tada: Happy birthday!')
           //      .setFooter('from '+msg.author.username, msg.author.displayAvatarURL())
           //      .setThumbnail(taggedUser.displayAvatarURL()) 
            var wish = {
                "embed": {
                    "title": "Happy Birthday,",
                    "description": ':cake: '+user+' :confetti_ball: :tada: Happy birthday!',
                    "color": '#41bfb1',
                    "footer": {
                        "icon_url": msg.author.displayAvatarURL(),
                        "text": 'from '+msg.author.username
                    },
                    "thumbnail": taggedUser.displayAvatarURL(),                    
                }
            }
                taggedUser.send(wish)
                msg.channel.send('I\'ve sent the birthday wish!')
                console.log('Sent birthday wish to '+taggedUser.username)
                // break;
                return;
        }
    },
};