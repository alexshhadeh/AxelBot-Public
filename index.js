const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const got = require('got');
const hastebin = require('hastebin-gen');
const ms = require("ms");
const giphy = require('giphy-api')("W8g6R14C0hpH6ZMon9HV9FTqKs4o4rCk");
const weather = require("weather-js")
var gracze = []
const talkedRecently = new Set();

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
	client.channels.get(`771631639705026591`).send(`Hello <@${member.id}>! 🍻`);
	console.log('@' + member.user.username + ' has joined the server!');
	client.channels.get(`690154190210596938`).fetchMessages().then((m) => {
		for (const [id, message] of m) {
			if(message.content==member.user.id.toString()) {
				if (!client.channels.exists(channel => channel.name === "izolatka"))
    				message.guild.createChannel('izolatka', { type: "text" });
				member.addRole(member.guild.roles.find(role => role.name === "AxelIsolate"));
			}
		}
	});
	client.channels.get(`690153856834863165`).fetchMessages().then((m) => {
		for (const [id, message] of m) {
			if(message.content==member.user.id.toString())
				member.addRole(member.guild.roles.find(role => role.name === "AxelMute"));
		}
	});
	if(client.channels.exists(channel => channel.name === "inba")) {
	    	member.addRole(member.guild.roles.find(role => role.name === "AxelInba"));
	}
	var role = member.guild.roles.find(role => role.name === "obywatel");
	member.addRole(role);
});

client.on('guildMemberRemove', member => {
	client.channels.get(`771631639705026591`).send(`\`${member.user.tag}\` has left the server 🤠`);
	console.log('@' + member.user.username + ' has left the server!');
	client.channels.get(`690154190210596938`).fetchMessages().then((m) => {
		for (const [id, message] of m) {
			if(message.content==member.user.id.toString() && m.size==1)
				message.guild.channels.find(channel => channel.name === "izolatka").delete();
		}
    });
});

var guesses;
var num = 0;
const randomizeCase = word => word.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');

client.on("message", async message => {
	if(message.author.bot) return;
 	if(message.content.indexOf(config.prefix) !== 0)
 	{
 		let messageArray = message.content.split(" ");
 		if(messageArray[0]=="-rep")
 		{
			if (talkedRecently.has(message.author.id)) {
				message.reply("wait 5 seconds before executing this command again!");
			} else {
	 			let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	 			let command = args.shift().toLowerCase();
		 		if(message.channel.type !== 'text')
		      		return message.reply("I can't execute this command here!");
		      	let toadd = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
				if (toadd.id === message.author.id)
		    		return message.reply("you can't take away your own reputation points!");
			  	let reason = args.slice(1).join(' ');
		    	if (reason.length>1024) {
		      		reason=reason.substring(0, 1020);
		      		reason+="..."
		    	}
				if (message.mentions.users.size < 1)
					return message.reply("please mention a valid member of this server!");
				if (reason.length < 1)
					reason = "Brak";
				let messages = await client.channels.get(`690153841856872534`).fetchMessages();
				var ilosc=-1;
				for (const [id, message] of messages) {
					let messageArray = message.content.split(" ");
		      		if(messageArray[parseInt(messageArray.length)-1].toString()==toadd.id.toString()) {
		      			ilosc=parseInt(messageArray[parseInt(messageArray.length)-2])-1
		      			message.delete();
		      		}

		    	}
		    	let mentionedUser = message.mentions.users.first() || message.author;
		    	client.channels.get(`690153841856872534`).send(toadd.user.tag.toString() + " " + ilosc.toString() + " " + toadd.id.toString());
				let dmsEmbed = new Discord.RichEmbed()
					.setAuthor(`One point less for you!`, `${mentionedUser.displayAvatarURL}`)
					.setThumbnail('https://cdn.discordapp.com/emojis/771685519934881812.png?v=1')
					.setColor("#ff0000")
					.setDescription(`<@${toadd.id}> has just lost a reputation point.`)
					.addField("Points left:", ilosc, true)
					.addField("Took away:", `<@${message.author.id}>`, true)
					.addField("Reason:", reason, true);

				message.channel.send(dmsEmbed);
			}
			talkedRecently.add(message.author.id);
			setTimeout(() => {
				talkedRecently.delete(message.author.id);
			}, 5000);
			return;
 		
 		} else return;
 	}
	let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	let messageArray = message.content.split(" ");
	let args2 = messageArray.slice(1);
	let command = args.shift().toLowerCase();
  
	if(command === "ping") {
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	}
	if(command === "say") {
		const sayMessage = args.join(" ");
		message.delete().catch(O_o=>{});
		message.channel.send(sayMessage);
	}
	if(command === "kick") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
			return message.reply("sorry, you don't have permissions to do that!");
		let reason = args.slice(1).join(' ');
		if (reason.length>1024) {
        	reason=reason.substring(0, 1020);
        	reason+="..."
      	}
	  	let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      	if(!user)
        	return message.reply("please mention a valid member of this server!");
      	if(!user.kickable) 
        	return message.reply("I can't kick this user! Do they have a higher role? Do I have kick permissions?");
      	
      	await user.kick(reason)
        	.catch(error => message.reply(`I couldn't kick the user because: ${error}`));
      	if(reason.length < 1)
	  		reason = "None"

	  	let dmsEmbed = new Discord.RichEmbed()
	  		.setTitle("Kick")
	  		.setColor("#8a2be2")
	  		.setDescription(`\`${user.user.tag}\` has been kicked from \`${message.guild.name}\``)
	  		.addField("Kicked by", `<@${message.author.id}>`)
	  		.addField("Reason", reason);

	  	let dmsEmbed2 = new Discord.RichEmbed()
			.setTitle("Kick")
			.setColor("#8a2be2")
			.setDescription(`You have been kicked from \`${message.guild.name}\``)
			.addField("Kicked by", message.author.tag)
			.addField("Reason", reason);

		message.channel.send(dmsEmbed);
		user.send(dmsEmbed2);
	}
	if(command === "ban") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");

		let reason = args.slice(1).join(' ');
    	if (reason.length>1024) {
        	reason=reason.substring(0, 1020);
        	reason+="..."
      	}
      	let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

      	if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009") {

      		if(!user)
        		return message.reply("please mention a valid member of this server!");
      		if(!user.kickable) 
        		return message.reply("I can't ban this user! Do they have a higher role? Do I have ban permissions?");
      		
      		await user.ban(reason)
        		.catch(error => message.reply(`I couldn't ban the user because: ${error}`));
      		if(reason.length < 1)
	  			reason = "None"

	  		let dmsEmbed = new Discord.RichEmbed()
	  			.setTitle("Ban")
	  			.setColor("#ff0000")
	  			.setDescription(`\`${user.user.tag}\` has been banned from \`${message.guild.name}\``)
	  			.addField("Banned by", `<@${message.author.id}>`)
	  			.addField("Reason", reason);

	  		let dmsEmbed2 = new Discord.RichEmbed()
	  			.setTitle("Ban")
	  			.setColor("#ff0000")
	  			.setDescription(`You have been banned from \`${message.guild.name}\``)
	  			.addField("Banned by", message.author.tag)
	  			.addField("Reason", reason);

	  		message.channel.send(dmsEmbed);
	  		user.send(dmsEmbed2);

    	} else if(user.user.tag==message.author.tag) {
      		await user.ban(reason)
        		.catch(error => message.reply(`I couldn't ban the user because: ${error}`));
      		if(reason.length < 1)
      			reason = "None"

			let dmsEmbed = new Discord.RichEmbed()
    			.setTitle("Ban")
    			.setColor("#ff0000")
    			.setDescription(`${user.user.tag} has just banned himself from \`${message.guild.name}\``)
    			.addField("Reason", reason);

    		let dmsEmbed2 = new Discord.RichEmbed()
    			.setTitle("Ban")
    			.setColor("#ff0000")
    			.setDescription(`You have just banned yourself from \`${message.guild.name}\``)
    			.addField("Reason", reason);

    		message.channel.send(dmsEmbed);
    		user.send(dmsEmbed2);
    	} else {
      		return message.reply("sorry, you don't have permissions to do that!");
    	}
	}
	if(command === "purge") {
    	if(message.channel.type !== 'text')
      		return message.reply("I can't execute this command here!");
      	if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
    	 	return message.reply("sorry, you don't have permissions to do that!");
      	let fejk=0
      	if(parseInt(args[0])>99) {
        	args[0]=99
        	fejk=100
      	} else if(parseInt(args[0])<1) {
      		return message.reply("please provide a valid number of messages to remove.");
      	}
      	const deleteCount = parseInt(args[0], 10)+1;
      	if(!deleteCount || deleteCount < 1)
        	return message.reply("please provide a valid number of messages to remove.");
      	const fetched = await message.channel.fetchMessages({limit: deleteCount});
      	message.channel.bulkDelete(fetched)
        	.catch(error => message.reply(`I couldn't delete the messages because: ${error}`));
      	if(fejk==100) {
      		message.channel.send(`Successfully purged 100 messages.`).then(msg => msg.delete(2000));
      	} else {
      		message.channel.send(`Successfully purged ${parseInt(args[0])} messages.`).then(msg => msg.delete(2000));
      	}
  	}
  	
  	if(command === "help") {
  		message.react("😈");
  		
  			helpmsg=`***You have asked for help. Here are my commands:***\n\n`;
  		others="`+say <text>` - makes the bot repeat your text and delete your message.\n`+ping` - checks the bot ping.\n`+kick <@user> <reason>` - kicks the user.\n`+ban <@user> <reason>` - bans the user.\n`+purge <number>` - removes specified number of messages.\n`+meme` - sends a funny meme.\n`+amazeme` - sends an amazing meme.\n`+joke` - sends a joke.\n`+pick <threshold>` - starts a single-player, random number guessing game.\n`+guess <number>` - guessing a number between 1 and 100. Game for many players.\n`+hastebin <text>` - uploads the text to Hastebin and sends a link to it.\n`+flip <text>` - flips the text upside down.\n`+avatar <@user>` - sends the avatar of the mentioned user.\n`+icon` - sends the icon of the server.\n`+botinfo` - sends the information about AxelBot.\n`+userinfo <@user>` - sends the information about the user.\n`+userid <@user>` - sends the ID of the user.\n`+serverinfo` - sends the information about the server.\n`+mute <@user> <time> / <reason>` - mutes the user for the specified amount of time. If <time> is empty, it mutes the user indefinitely.\n`+unmute <@user>` - unmutes the user.\n`+gif` - sends a gif\n`+lenny` - sends lenny.\n`+megusta` - sends me gusta\n`+mock <text>` - mocks the text.\n`+warn <@user>` - warns the user.\n`+weather <city>` - shows the weather in the specified city.\n`+poll <text>` - starts a simple poll with reactions 👍🏻, 👎🏻 and 🤷🏻‍♂️.\n`+inbastart <time>` - starts inba for the specified amount of time. If <time> is empty, it starts inba indefinitely.\n`+inbastop` - ends the inba.\n`+addrole <@user> <role>` - gives the user the role.\n`+removerole <@user> <role>` - removes the role from the user.\n`+cipher <number> <text>` - ciphers the text with three different ciphers.\n`+isolate <@user>` - moves the user to an isolated channel.\n`+free <@user>` - frees the user from the isolation.\n`+rep <@user>` - gives the user a reputation point.\n`+stats` - shows how many reputation points the users have.";
  		message.author.send(helpmsg + others);
  	}
  	
  	if(command === "dmos") {
    	message.channel.send("Znajdę cię");
  	}
  	if(command === "meme") {
		const embed = new Discord.RichEmbed();
		got('https://www.reddit.com/r/memes/random/.json').then(response => {
	        let content = JSON.parse(response.body);
	        let permalink = content[0].data.children[0].data.permalink;
	        let memeUrl = `https://reddit.com${permalink}`;
	        let memeImage = content[0].data.children[0].data.url;
	        let memeTitle = content[0].data.children[0].data.title;
	        let memeUpvotes = content[0].data.children[0].data.ups;
	        let memeDownvotes = content[0].data.children[0].data.downs;
	        let memeNumComments = content[0].data.children[0].data.num_comments;

	        embed.addField(`${memeTitle}`, `[View thread](${memeUrl})`);
	        embed.setImage(memeImage);
	        embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`);

	        message.channel.send(embed)
	            .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
	        console.log('Bot responded with: ' + memeImage);
    	}).catch(console.error);
  	}
  	if(command === "amazeme") {
    	got('https://www.reddit.com/r/interestingasfuck/random.json').then(response => {
        	let content = JSON.parse(response.body);
        	var title = content[0].data.children[0].data.title;
        	var amazeme = content[0].data.children[0].data.url;
        	message.channel.send('**' + title + '**');
        	message.channel.send(amazeme)
        		.then(sent => console.log(`Sent a reply to ${sent.author.username}`))
    	}).catch(console.error);
  	}
  	if(command === "joke") {
	    got('https://www.reddit.com/r/jokes/random/.json').then(response => {
	        let content = JSON.parse(response.body);
	        var title = content[0].data.children[0].data.title;
	        var joke = content[0].data.children[0].data.selftext;
	        message.channel.send('**' + title + '**');
	        message.channel.send(joke)
	        .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
	    }).catch(console.error);
  	}
  	if(isNaN(parseFloat(command)) == false) {
  		if(command === "997") {
    	return message.channel.send("Ten numer to kłopoty!");
  		}
  		if(command === "7100") {
    	return message.channel.send("Ten numer to kłopoty!");
    	}
    	let x=parseFloat(command)+1
    	if(x=="Infinity")
      		x="∞"
      	if(x=="-Infinity")
      		x="-∞"
    	if(x.toString()[1]=="e" || x.toString()[2]=="e") {
      		x="∞"
    	}
    	message.channel.send("+" + x);
    }
  	if(command.toString()[0] == '∞') {
  		if(command == "∞") {
  			message.channel.send("+∞+1");
  		} else {
  			command=command.toString().substring(2, command.toString().length)
	    	if(isNaN(parseInt(command)) == false) {
	    	let x=parseInt(command)+1
	    	if(x=="Infinity" || x=="-Infinity")
	      		x="∞"
	    	if(x.toString()[1]=="e" || x.toString()[2]=="e") {
	      		x="∞"
	    	}
	    	message.channel.send("+∞+" + x);
    		}
    	}
  	}
  	if(command.toString()[0] == '-' && command.toString()[1] == '∞') {
  		if(command == "-∞") {
  			message.channel.send("+-∞-1");
  		} else {
  			command=command.toString().substring(3, command.toString().length)
	    	if(isNaN(parseInt(command)) == false) {
	    	let x=parseInt(command)+1
	    	if(x=="Infinity" || x=="-Infinity")
	      		x="∞"
	    	if(x.toString()[1]=="e" || x.toString()[2]=="e") {
	      		x="∞"
	    	}
	    	message.channel.send("+-∞-" + x);
	    	}
	    }
  	}
  	if(command == 'pick') {
  		if(parseInt(args[0])<2 || isNaN(parseInt(args[0])))
  			return message.reply('please provide a valid threshold!')
  		if(gracze.length>0) {
	  		for(let uzytkownik of gracze){
	  			if(uzytkownik.toString()==message.author.id.toString())
	  				return message.reply("you've already started a game!");
	  		}
	  	}
  		gracze.push(message.author.id);
  		let a = gracze.indexOf(message.author.id.toString());
        message.reply('picking a random number between 1 and ' + parseInt(args[0]));
        let number = Math.floor((Math.random() * parseInt(args[0])) + 1);
        if(number==0)
        	number++;
        console.log(number)
        let guess=0;
        let win=0;
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        if(win==0) {
        collector.on('collect', message => {
        	if(win==0) {
	        	if(message.content=="+stop") {
	        		gracze.splice(a, 1);
	        		win=1;
	        		return message.reply("the game has been stopped.");
	            } else if (parseInt(message.content) < number) {
	                message.reply(parseInt(message.content) + ' is too low');
	            	guess++;
	            } else if (parseInt(message.content) > number) {
	                message.reply(parseInt(message.content) + ' is too high');
	            	guess++;
	            } else if (parseInt(message.content)==number) {
	            	guess++;
	            	gracze.splice(a, 1);
	            	win=1;
	            	if(guess<=5)
	            		return message.reply('you got it! It took you only ' + guess + ' tries.');
	            	else
	            		return message.reply('you got it! It took you ' + guess + ' tries.');
	            }
	        }
        })
      }
    }
    if(command == 'random') {
    	var sayings=["uwu", "^^", "😈", "🤠", "💩", "🤩", "[̲̅$̲̅(ツ)$̲̅]", "( ͡° ͜ʖ ͡°)", "(ツ)"]
    	message.channel.send(Math.floor(Math.random() * 100).toString() + " " + sayings[Math.floor(Math.random() * sayings.length)]);
    }
	if(command == 'guess') {
    	if(!args[0]) {
    		message.reply('picking a random number between 1 and 100');
        	num = Math.floor((Math.random() * 100) + 1);
        	console.log(num)
        	guesses = 0;
    	}
        if(parseInt(args[0])>100 || parseInt(args[0])<1)
          return message.reply('please guess a number between 1 and 100')
        if (num == 0) {
	        num++;
        }
        if(parseInt(args[0]) == num) {
            guesses++;
            if(guesses<=5)
            	message.reply('you got it! It took you only ' + guesses + ' tries.');
            else
            	message.reply('you got it! It took you ' + guesses + ' tries.');
            message.reply('picking a random number between 1 and 100');
            num = Math.floor((Math.random() * 100) + 1);
            console.log(num)
            guesses = 0;
        } else if(parseInt(args[0]) < num) {
            message.reply(parseInt(args[0]) + ' is too low');
            guesses++;
        } else if(parseInt(args[0]) > num) {
            message.reply(parseInt(args[0]) + ' is too high');
            guesses++;
        }
  	}
	if(command === "flip") {
	    let normal = "abcdefghijklmnopqrstuvwxyz_,;.?&[](){}!<>/\\'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
		let flipped  = "ɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇnʌʍxʎz‾'؛˙¿⅋][)(}{¡></\\,∀qϽᗡƎℲ⅁HIſʞ˥WNOԀὉᴚS⊥∩ΛMXʎZ0ƖᄅƐㄣϛ9ㄥ86 ";
		let zdanie="";
	      for(k = 0; k<args.length; k++) {
	        	zdanie+=args[k];
	        	zdanie+=" ";
	      }
	    let pom=0
	    let pom2=0
	    let result="";
		for(i=0; i<zdanie.length; i++) {
			for(j=0; j<normal.length; j++) {
				if(zdanie[i]==normal[j]) {
					result+=flipped[j];
				} else {
					if(j==(normal.length)-1) {
						pom2=pom;
						pom=result.length;
						if(pom2==pom)
							result+=zdanie[i];
					}
				}
			}
		}
		message.channel.send(result.split('').reverse().join(''))
			.catch(error => message.reply(`I couldn't flip the text because: ${error}`));
	}
	if(command === "hastebin") {
		let haste = args.slice(0).join(" ")
        let type = args.slice(1).join(" ")
        if (!args[0]) {
        	let msg = await message.channel.send("What do you want to post in Hastebin?");
        }
        hastebin(haste).then(r => {
            message.channel.send("`Posted to Hastebin at this URL:`  " + r);
        }).catch(console.error);
	}
	if(command === "avatar") {
		let mentionedUser = message.mentions.users.first() || message.author;

        let embed = new Discord.RichEmbed()
        	.setImage(mentionedUser.displayAvatarURL)
        	.setColor("FF6347")
        	.setTitle("Avatar")
        	.setFooter("Searched by " + message.author.tag)
        	.setDescription("[Avatar URL link]("+mentionedUser.displayAvatarURL+")");

        message.channel.send(embed)
	}
	if(command === "icon") {
		if(message.channel.type !== 'text')
	    	return message.reply("I can't execute this command here!");
		let msg = await message.channel.send("Generating icon...");
		if(!message.guild.iconURL) return msg.edit("No icon found!");

		let iconembed = new Discord.RichEmbed()
			.setColor("FF6347")
			.setFooter("Searched by " + message.author.tag)
			.setImage(message.guild.iconURL)
			.setTitle("Icon")
			.setDescription("[Icon URL link]("+message.guild.iconURL+")")

    	message.channel.send(iconembed)
	}
	if(command === "botinfo") {
	    let inline = true
	    let bicon = client.user.displayAvatarURL;
	    let usersize = client.users.size
	    let chansize = client.channels.size
	    let uptimxd = client.uptime 
	    let servsize = client.guilds.size
	    let botembed = new Discord.RichEmbed()
		    .setColor("FF6347")
		    .setThumbnail(bicon)
		    .addField("Bot Name", `${client.user.username}`, inline)
		    .addField("Bot Owner", "<@599370208377045013>", inline )
		    .addField("Servers", `${servsize}`, inline)
		    .addField("Channels", `${chansize}`, inline)
		    .addField("Users", `${usersize}`, inline)
		    .addField("Bot Library", "Discord.js", inline)
		    .addField("Created On", client.user.createdAt)
		    .setFooter(`Information about: ${client.user.username}. Developed by: @alex.sh`)
		    .setTimestamp()
    
    	message.channel.send(botembed);
	}
	if(command === "serverinfo") {
		if(message.channel.type !== 'text')
	    	return message.reply("I can't execute this command here!");
	    const verlvl = {
		    0: "None",
		    1: "Low",
		    2: "Medium",
		    3: "(╯°□°）╯︵ ┻━┻",
		    4: "(ノಠ益ಠ)ノ彡┻━┻"
	    }

	    let inline = true
	    let sicon = message.guild.iconURL;
	    let serverembed = new Discord.RichEmbed()
		    .setColor("FF6347")
		    .setThumbnail(sicon)
		    .setAuthor(message.guild.name)
		    .addField("Name", message.guild.name, inline)
		    .addField("ID", message.guild.id, inline)
		    .addField("Owner", message.guild.owner, inline)
		    .addField("Region", message.guild.region, inline)
		    .addField("Verification Level", verlvl[message.guild.verificationLevel],inline)
		    .addField("Members", `${message.guild.memberCount}`, inline)
		    .addField("Roles", message.guild.roles.size, inline)
		    .addField("Channels", message.guild.channels.size, inline)
		    .addField("You Joined", message.member.joinedAt)
		    .setFooter(`Created ${message.guild.createdAt}`);

    	message.channel.send(serverembed);
	}
	if(command === "id") {
    	const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    	message.channel.send(`ID: \`${member.user.id}\`.`);
	}
	if(command === "mute") {
	    if(message.channel.type !== 'text')
	    	return message.reply("I can't execute this command here!");
    	let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	    if(!tomute)
	    	return message.reply("please mention a valid member of this server!");
	    if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
	    	return message.reply("sorry, you don't have permissions to do that!");
	    if(tomute.hasPermission("ADMINISTRATOR"))
	    	return message.reply("I can't mute this user!");
	    if (tomute.id === message.author.id)
	    	return message.reply("you can't mute yourself!");
	    if(tomute.id==client.user.id)
			return message.reply("I can't mute myself!");
		let yes=0;
		let messages = await client.channels.get(`690153856834863165`).fetchMessages();
		for (const [id, message] of messages) {
	      	if(message.content==tomute.id.toString())
	      		yes=1;
	    }
	    if(yes==1)
	    	return message.reply("this user has already been muted!");
	    else if(yes==0)
	    	client.channels.get(`690153856834863165`).send(tomute.id.toString());

    	let muterole = message.guild.roles.find(role => role.name === "AxelMute");
	    if(args[2] == "/") {
	    	if(parseInt(args[1])>1 && parseInt(args[1])<1000) {
	    		var mutetime = args[1];
	    	}
	    	var reason = args.slice(3).join(' ');
	    }
	    else if (args[1] == "/") {
	    	var reason = args.slice(2).join(' ');
	    }
	    else {
	    	var reason = "None" 
	    	if(parseInt(args[1])>1 && parseInt(args[1])<1000) {
	    		var mutetime = args[1];
	    	}
	    }

	    if(!muterole) {
			try{
				muterole = await message.guild.createRole({
					name: "AxelMute",
					color: "#000000",
					permissions:[]
	        	}) .catch(error => message.reply(`I couldn't create the muterole because: ${error}`));
	        	message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(muterole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false
					}) .catch(error => message.reply(`I couldn't overwrite the muterole permissions because: ${error}`));
				});
			} catch(e) {
	        	console.log(e.stack);
			}
	    }

		if(!mutetime) {
			await(tomute.addRole(muterole.id))
				.catch(error => message.reply(`I couldn't mute the user because: ${error}`));
			let dmsEmbed = new Discord.RichEmbed()
				.setTitle("Mute")
				.setColor("#e5e500")
				.setDescription(`<@${tomute.id}> has been muted indefinitely.`)
				.addField("Muted by", `<@${message.author.id}>`)
				.addField("Reason", reason);

			message.channel.send(dmsEmbed);
    	} else {
    		await(tomute.addRole(muterole.id))
    			.catch(error => message.reply(`I couldn't mute the user because: ${error}`));
		let dmsEmbed2 = new Discord.RichEmbed()
			.setTitle("Mute")
			.setColor("#e5e500")
			.setDescription(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}.`)
			.addField("Muted by", `<@${message.author.id}>`)
			.addField("Reason", reason);

		message.channel.send(dmsEmbed2);
		}
		if(mutetime) {
			setTimeout(function(){
				client.channels.get(`690153856834863165`).fetchMessages().then((messages) => {
					for (const [id, message] of messages) {
		      			if(message.content==tomute.id.toString())
		      				message.delete();
		    		}
		    	});
				tomute.removeRole(muterole.id)
					.catch(error => message.reply(`I couldn't unmute the user because: ${error}`));
	      		let dmsEmbed3 = new Discord.RichEmbed()
		  			.setTitle("Unmute")
		  			.setColor("#00ff00")
		  			.setDescription(`<@${tomute.id}> has been unmuted.`)

		  		message.channel.send(dmsEmbed3);
    		}, ms(mutetime));
		}
	}
	if(command === "unmute") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
			return message.reply("sorry, you don't have permissions to do that!");

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute)
        	return message.reply("please mention a valid member of this server!");

        let role = message.guild.roles.find(role => role.name === "AxelMute");
        
        if(!role || !toMute.roles.has(role.id))
        	return message.reply("this user is not muted!");

		let yes=0;
		let messages = await client.channels.get(`690153856834863165`).fetchMessages();
		for (const [id, message] of messages) {
      		if(message.content==toMute.id.toString())
      			message.delete();
      			yes=1;
    	}
    	if(yes==0)
    		return message.reply("this user is not muted!");

        await toMute.removeRole(role)
        	.catch(error => message.reply(`I couldn't unmute the user because: ${error}`));
        let dmsEmbed = new Discord.RichEmbed()
	  	.setTitle("Unmute")
	  	.setColor("#00ff00")
	  	.setDescription(`<@${toMute.id}> has been unmuted.`)

	  	message.channel.send(dmsEmbed);
	}
	if(command === "gif") {
	    if (args.length === 0)
	    	return message.reply('No seacrh terms!');

	    if (args.length === 1)
	    	term = args.toString()
	    else
			term = args.join(" ");

	    giphy.search(term).then(function (res) {
	    	let id = res.data[0].id
	    	let msgurl = `https://media.giphy.com/media/${id}/giphy.gif`
	    	const embed = {
	     		"color": 3066993,
	    		"timestamp": new Date(),
	        	"footer": {
	        		"icon_url": "https://raw.githubusercontent.com/Giphy/GiphyAPI/f68a8f1663f29dd9e8e4ea728421eb2977e42d83/api_giphy_logo_sparkle_clear.gif",
	        		"text": "Powered by Giphy"
	        	},
		        "image": {
		        	"url": msgurl
		        },
		        "fields": [
		        	{
		        		"name": "Search Term",
		        		"value": "`" + term + "`",
		        		"inline": true
		         	},
		         	{
		            	"name": "Page URL",
		            	"value": "[Giphy](" + res.data[0].url + ")",
		            	"inline": true
		          	}
		        ]
	    	};
			message.channel.send({ embed });
		});
	}
	if(command === "lenny") {
		message.channel.send("( ͡° ͜ʖ ͡°)");
	}
	if(command === "shrug") {
		message.channel.send("¯\\_\(ツ)\_\/¯");
	}
	if(command === "megusta") {
		let megustafac = new Discord.RichEmbed()
			.setColor("FF6347")
			.setImage("https://cdn.discordapp.com/attachments/424889733043191810/428888675603185666/b710a35966ecbbf7988bf40bb47b0e4d-me-gusta-meme-face-by-vexels.png");
		message.channel.send(megustafac)
	}
	if(command === "mock") {
		if (args.length < 1)
			return message.reply("please provide some text to mock!")

		let mockEmbed = new Discord.RichEmbed()
			.setColor("FF6347")
			.setDescription(args.map(randomizeCase).join(' '))
			.setImage("https://cdn.discordapp.com/attachments/424889733043191810/425242569325150208/mock.jpg")

		message.channel.send(mockEmbed)
	}
	if(command === "inbastart") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
      		return message.reply("nie baw się w admina dzieciaku");
    
		if(message.guild.channels.exists(channel => channel.name === "inba"))
    		return message.reply("inba już trwa!");

    	message.channel.send("Rozpoczynanie inby...");

		let inbatime = args[0];
		if(!inbatime)
			client.channels.get(`690149095993901146`).send(`Rozpoczynanie inby na czas nieokreślony...`);
		else
			client.channels.get(`690149095993901146`).send(`Rozpoczynanie inby na ${ms(ms(inbatime))}`);

		let inbarole = message.guild.roles.find(role => role.name === "AxelInba");
		if(!inbarole) {
			try {
				inbarole = await message.guild.createRole({
					name: "AxelInba",
          			color: "#000000",
          			permissions:[]
        		})
				message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(inbarole, {
            			SEND_MESSAGES: false,
            			VIEW_CHANNEL: false,
            			ADD_REACTIONS: false
          			});
        		});
      		} catch(e) {
        		console.log(e.stack);
      		}
    	}
		message.guild.members.filter(m => !m.user.bot).forEach(member => member.addRole(inbarole.id));
		message.guild.createChannel('inba', { type: "text" });

		if(inbatime) {
			setTimeout(function() {
				inbarole.delete();
				
				const fetchedChannel = message.guild.channels.find(channel => channel.name === "inba");
				fetchedChannel.delete();
				client.channels.get(`690149095993901146`).send(`Inba zakończona!`);
			}, ms(inbatime));
		}
	}
	if(command === "inbastop") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
			return message.reply("nie baw się w admina dzieciaku");

    	if(message.guild.channels.exists(channel => channel.name === "inba")) {
	    	let inbarole = message.guild.roles.find(role => role.name === "AxelInba");
	    	inbarole.delete();
	        
	        const fetchedChannel = message.guild.channels.find(channel => channel.name === "inba");
	        fetchedChannel.delete();
	       	client.channels.get(`690149095993901146`).send(`Inba zakończona!`);
	    } else {
	    	return message.reply("inba nie została rozpoczęta!");
	    }
	}
	if(command === "userinfo") {
		if(message.channel.type !== 'text')
      		return message.reply("I can't execute this command here!");
		let inline = true
    	let resence = true
    	const status = {
        	online: "Online",
        	idle: "Idle",
        	dnd: "Do Not Disturb",
        	offline: "Offline/Invisible"
    	}

    	const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
		let target = message.mentions.users.first() || message.author

		if (member.user.bot === true)
    		bot = "Yes";
  		else
    		bot = "No";

            let embed = new Discord.RichEmbed()
                .setThumbnail((target.displayAvatarURL))
                .setColor("FF6347")
                .addField("Full Username", `${member.user.tag}`, inline)
                .addField("ID", member.user.id, inline)
                .addField("Nickname", `${member.nickname !== null ? `Nickname: ${member.nickname}` : "None"}`, true)
                .addField("Bot", `${bot}`,inline, true)
                .addField("Status", `${status[member.user.presence.status]}`, inline, true)
                .addField("Playing", `${member.user.presence.game ? `${member.user.presence.game.name}` : "Not playing"}`,inline, true)
                .addField("Roles", `${member.roles.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "No Roles"}`, true)
                .addField("Joined Discord At", member.user.createdAt)
                .setFooter(`Information about ${member.user.username}`)
                .setTimestamp()
    
            message.channel.send(embed);
	}
	if(command === "warn") {
		if(message.channel.type !== 'text')
      		return message.reply("I can't execute this command here!");
	  
		let reason = args.slice(1).join(' ');
    	if(reason.length>1024) {
     		reason=reason.substring(0, 1020);
    		reason+="..."
    	}
		let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(message.mentions.users.size < 1)
			return message.reply("please mention a valid member of this server!");
		if(reason.length < 1)
	  		reason = "None"

		let dmsEmbed = new Discord.RichEmbed()
			.setTitle("Warn")
			.setColor("FF6347")
			.setDescription(`<@${user.id}> has been warned on \`${message.guild.name}\``)
			.addField("Warned by", `<@${message.author.id}>`)
			.addField("Reason", reason);

		message.channel.send(dmsEmbed);
	}
	if(command === "weather") {
		

		weather.find({search: args.join(" "), degreeType: "C"}, function(err, result) {
	        if(err)
	        	message.channel.send(err)
	        if(result.length === 0)
	            return message.reply("please enter a valid location!");
	        var current = result[0].current
	        var location = result[0].location
	        let allwords = current.observationpoint
	        
	        let embed = new Discord.RichEmbed()
	           .setDescription(`**${current.skytext}**`)
	           .setAuthor(`Weather for ${allwords}`)
	           .setThumbnail(current.imageUrl)
	           .setColor(0x00AE86)
	           .addField("Timezone", `UTC${location.timezone}`, true)
	           .addField("Degree Type", location.degreetype, true)
	           .addField("Temperature", `${current.temperature}`, true)
	           .addField("Feels like", `${current.feelslike} Degrees`, true)
	           .addField("Winds", current.winddisplay, true)
	           .addField("Humidity", ` ${current.humidity}%`, true)
	           .addField("Day", `${current.day}`, true)
	           .addField("Date", `${current.date}`, true)
	           message.channel.send(embed)
    	});
	}
	if(command === "poll") {
		let question = args.slice(0).join(" ");
		message.delete()
		if (args.length === 0)
			return message.reply('Invalid Format! +poll <question>')

		const embed = new Discord.RichEmbed()
			.setTitle("Poll:")
			.setColor("#FF6347")
			.setDescription(`${question}`)
			.setFooter(`Poll started by: ${message.author.username}`, `${message.author.avatarURL}`)

		message.channel.send(embed).then((m) => {
	  		message.delete();
	  		try {
	      		m.react('👍🏻')
	      		.then(() => m.react('👎🏻'))
	      		.then(() => m.react('🤷🏻‍♂️'))
	    	} catch (error) {
	    		console.error('Emoji failed to react.');
  			}
  		});
		
	}
	if(command === "addrole") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
			return message.reply("Sorry, you don't have permissions to do that!");
		let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if(!rMember)
			return message.reply("please mention a valid member of the server!");
		args.shift();
		let role = args.join(" ");
		if(!role)
			return message.reply("please enter a valid role!");
		let gRole = message.guild.roles.find(r => r.name === role);
		if(!gRole)
			return message.reply("couldn't find that role.");

		if(rMember.roles.has(gRole.id))
			return message.reply("this user already has that role.");
		await(rMember.addRole(gRole.id))
			.catch(error => message.reply(`I couldn't give the role because: ${error}`));

		await message.reply(`successfully gave <@${rMember.id}> role ${gRole.name}`)
	}
	if(command === "removerole") {
		if(message.channel.type !== 'text')
      		return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
    		return message.reply("Sorry, you don't have permissions to do that!");
		let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if(!rMember)
			return message.reply("please mention a valid member of the server!");
		args.shift();
		let role = args.join(" ");
		if(!role)
			return message.reply("please enter a valid role!");
		let gRole = message.guild.roles.find(r => r.name === role);
		if(!gRole)
			return message.reply("couldn't find that role.");

		if(!rMember.roles.has(gRole.id))
			return message.reply("this user doesn't have that role.");
		await(rMember.removeRole(gRole.id))
			.catch(error => message.reply(`I couldn't remove the role because: ${error}`));

		await message.reply(`successfully removed role ${gRole.name} from <@${rMember.id}>`)
	}
	
  	
  	if(command === "rot") {
      if(args.length<2)
      	return message.channel.send("Invalid format! +rot <key> <text>");
      if(isNaN(parseInt(args[0])))
      	return message.channel.send("Invalid format! +rot <key> <text>");
      if(parseInt(args[0])>99 || parseInt(args[0])<-99)
      	return message.channel.send("Please provide a number between -99 and 99.");
      let n=parseInt(args[0])
      args.shift()
      zdanie=""
      for(k = 0; k<args.length; k++) {
        	zdanie+=args[k]
        	zdanie+=" "
      }
      let result="";
      let alphabet="abcdefghijklmnopqrstuvwxyz";
      let alphabet2=alphabet.toUpperCase();
      for(i=0; i<zdanie.length; i++) {
      	
      	if(zdanie[i]==" ") {
	      			result+=" ";
	      			if((i+1)<zdanie.length)
	      				i++
	      		}
      	if(zdanie[i]==zdanie[i].toLowerCase()) {
	      	for(j=0; j<alphabet.length; j++) {
	      		if(alphabet[j]==zdanie[i]) {
	      			let x=(j+n);
	      			while(x>=26) {
	      				x-=26;
	      			}
	      			while(x<0) {
	      				x+=26;
	      			}
	      			
	      			result+=alphabet[x];
	      		}
	      	}
      	} else if (zdanie[i]==zdanie[i].toUpperCase()) {
      		for(j=0; j<alphabet2.length; j++) {
	      		if(alphabet2[j]==zdanie[i]) {
	      			let x=(j+n);
	      			while(x>=26) {
	      				x-=26;
	      			}
	      			while(x<0) {
	      				x+=26;
	      			}
	      			
	      			result+=alphabet2[x];
	      		}
	      	}
      	}
      }
      message.channel.send(result)
      	.catch(error => message.reply(`I couldn't cipher the message because: ${error}`));
  	}
  	
  	if(command === "cipher") {
  		if(args.length<2)
			return message.channel.send("Invalid format! +cipher <key> <text>");
		if(isNaN(parseInt(args[0])))
			return message.channel.send("Invalid format! +cipher <key> <text>");
		let klucz=parseInt(args[0])
		args.shift()
		let tekst=args.join("");
		function msscpl(tekst, klucz){
		    let alfabet = [
		        'a','ą','b','c','ć','d','e','ę','f','g','h','i','j','k','l','ł','m','n','ń','o','ó','p','q','r','s','ś','t','u','v','w','x','y','z','ź','ż',
		        'A','Ą','B','C','Ć','D','E','Ę','F','G','H','I','J','K','L','Ł','M','N','Ń','O','Ó','P','Q','R','S','Ś','T','U','V','W','X','Y','Z','Ź','Ż',
		        '0','1','2','3','4','5','6','7','8','9',
		        '!','@','#','$','%','^','&','*','(',')','-','_','+','=','[','{',']','}','|',';',':','"',"'",',','<','.','>','?','/','`','~',' '
		    ];
		    klucz = klucz % alfabet.length;
		    let wyjscie = '';
		    for(let znak of tekst){
		        if(alfabet.indexOf(znak)!=-1){
		            wyjscie += alfabet[Math.abs(alfabet.indexOf(znak) + klucz) % alfabet.length];
		        }
		    }
		    return wyjscie;
		}
		function mssc(tekst, klucz){
		    let alfabet = [
	        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
	        '0','1','2','3','4','5','6','7','8','9',
	        '!','@','#','$','%','^','&','*','(',')','-','_','+','=','[','{',']','}','|',';',':','"',"'",',','<','.','>','?','/','`','~', ' '
	    ];
		    klucz = klucz % alfabet.length;
		    let wyjscie = '';
		    for(let znak of tekst){
		        if(alfabet.indexOf(znak)!=-1){
		            wyjscie += alfabet[Math.abs(alfabet.indexOf(znak) + klucz) % alfabet.length];
		        }
		    }
		    return wyjscie;
		}
		function caesar(message, shift) {
		  if (shift < 0) {
		    shift = 26 + (shift % 26);
		  }
		  return message
		    .split("")
		    .map(message => {
		      normalStr = String.fromCharCode(message.charCodeAt())
		      prePoint = message.charCodeAt()
		      if (prePoint >= 65 && prePoint <= 90) {
		        return String.fromCharCode(((prePoint - 65 + shift) % 26) + 65);
		      } else if (prePoint >= 97 && prePoint <= 122) {
		        return String.fromCharCode(((prePoint - 97 + shift) % 26) + 97)
		      } else {
		        return normalStr;
		      }
		    })
		    .join("");
		}
		if((mssc(tekst, klucz)).length<=1985 || (msscpl(tekst, klucz)).length<=1962 || (caesar(tekst, klucz)).length<=1974) {
			message.channel.send(`MSSC's cipher: ${mssc(tekst, klucz)}`)
				.catch(error => message.reply(`I couldn't cipher the message with MSSC's cipher, because: ${error}`));
			message.channel.send(`MSSC's cipher with polish characters: ${msscpl(tekst, klucz)}`)
				.catch(error => message.reply(`I couldn't cipher the message with MSSC's cipher with polish characters, because: ${error}`));
			message.channel.send(`Original Caesar's cipher: ${caesar(tekst, klucz)}`)
				.catch(error => message.reply(`I couldn't cipher the message with Caesar's cipher, because: ${error}`));
		} else {
			message.channel.send({ files: [{ attachment: Buffer.from(`MSSC's cipher: ${mssc(tekst, klucz)}\n\nMSSC's cipher with polish characters: ${msscpl(tekst, klucz)}\n\nOriginal Caesar's cipher: ${caesar(tekst, klucz)}`, 'UTF8'), name: "ciphered message.txt" }] })
				.catch(error => message.reply(`I couldn't cipher the message, because: ${error}`));
		}
  	}
  	
	if(command === "rep") {
		if (talkedRecently.has(message.author.id)) {
			message.reply("wait 5 seconds before executing this command again!");
		} else {
			if(message.channel.type !== 'text')
	      		return message.reply("I can't execute this command here!");
	      	let toadd = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
			if (toadd.id === message.author.id)
	    		return message.reply("you can't give reputation points yourself!");
		  	let reason = args.slice(1).join(' ');
	    	if (reason.length>1024) {
	      		reason=reason.substring(0, 1020);
	      		reason+="..."
	    	}
			if (message.mentions.users.size < 1)
				return message.reply("please mention a valid member of this server!");
			if (reason.length < 1)
				reason = "Brak";
			let messages = await client.channels.get(`690153841856872534`).fetchMessages();
			var ilosc=1;
			for (const [id, message] of messages) {
				let messageArray = message.content.split(" ");
	      		if(messageArray[parseInt(messageArray.length)-1].toString()==toadd.id.toString()) {
	      			ilosc=parseInt(messageArray[parseInt(messageArray.length)-2])+1
	      			message.delete();
	      		}

	    	}
			let mentionedUser = message.mentions.users.first() || message.author;
		    client.channels.get(`690153841856872534`).send(toadd.user.tag.toString() + " " + ilosc.toString() + " " + toadd.id.toString());
			let dmsEmbed = new Discord.RichEmbed()
				.setAuthor(`One point more for you!`, `${mentionedUser.displayAvatarURL}`)
				.setThumbnail('https://cdn.discordapp.com/emojis/771685521436442624.png?v=1')
				.setColor("#00ff00")
				.setDescription(`<@${toadd.id}> has just gotten a new reputation point.`)
				.addField("Points:", ilosc, true)
				.addField("Given by:", `<@${message.author.id}>`, true)
				.addField("Reason:", reason, true);

			message.channel.send(dmsEmbed);
		}
		talkedRecently.add(message.author.id);
		setTimeout(() => {
			talkedRecently.delete(message.author.id);
		}, 5000);
	}
	
	if(command === "stats") {
		users=[]
		points=[]
		let messages = await client.channels.get(`690153841856872534`).fetchMessages();
		for (const [id, message] of messages) {
			let messageArray = message.content.split(" ");
			if(client.fetchUser(messageArray[parseInt(messageArray.length)-1]).toString()=="undefined") {
      			users.push(client.fetchUser(messageArray[parseInt(messageArray.length)-1]).toString());
      		} else {
      			if(parseInt(messageArray.length)>3) {
      				let x = parseInt(messageArray.length)-3
      				let i=0
      				let str = ""
      				while(i<=x) {
      					str+=messageArray[i]
      					i+=1
      				}
      				users.push(str);
      			} else {
      				users.push(messageArray[0]);
      			}
      			
      		}
      		points.push(parseInt(messageArray[parseInt(messageArray.length)-2]));
    	}
    	let dmsEmbed = new Discord.RichEmbed()
    		.setTitle("Reputation stats")
    		.setColor("#FF6347")
    	let i
    	let pozycja
    	while(points.length>0) {
    		i=Math.max(...points);
    		pozycja=points.indexOf(i);
    		if(parseInt(i)==1)
				dmsEmbed.addField(i + " point:", users[pozycja])
			else
				dmsEmbed.addField(i + " points:", users[pozycja])
			points.splice(pozycja, 1);
			users.splice(pozycja, 1);
    	}
    	
    	message.channel.send(dmsEmbed)
	  		.catch(error => message.reply(`I couldn't get the information about stats, because: ${error}`));
	}
	if(command === "isolate") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
			return message.reply("Sorry, you don't have permissions to do that!");
		let toisolate = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!toisolate)
    		return message.reply("please mention a valid member of this server!");
    	if(toisolate.id==client.user.id)
			return message.reply("I can't isolate myself!");
    	if(toisolate.hasPermission("ADMINISTRATOR"))
    		return message.reply("I can't isolate this user!");
    	let reason = args.slice(1).join(' ');
    	if (reason.length>1024) {
      		reason=reason.substring(0, 1020);
      		reason+="..."
    	}
    	if(reason.length < 1)
    		reason="None";
		let yes=0;
		let messages = await client.channels.get(`690154190210596938`).fetchMessages();
		for (const [id, message] of messages) {
      		if(message.content==toisolate.id.toString())
      			yes=1;
    	}
    	if(yes==1)
    		return message.reply("this user has already been isolated!");
    	else if(yes==0)
    		client.channels.get(`690154190210596938`).send(toisolate.id.toString());
    	if (!message.guild.channels.exists(channel => channel.name === "izolatka"))
    		message.guild.createChannel('izolatka', { type: "text" });
		let isolaterole = message.guild.roles.find(role => role.name === "AxelIsolate");
    	if(!isolaterole){
      		try{
        		isolaterole = await message.guild.createRole({
          		name: "AxelIsolate",
          		color: "#000000",
          		permissions:[]
        	})
       		message.guild.channels.forEach(async (channel, id) => {
          		await channel.overwritePermissions(isolaterole, {
            		SEND_MESSAGES: false,
            		VIEW_CHANNEL: false,
            		ADD_REACTIONS: false
          		});
        	});
      		}catch(e){
        		console.log(e.stack);
      		}

    	}
    	
    	let dmsEmbed = new Discord.RichEmbed()
			.setTitle("Isolation")
			.setColor("#C0C0C0")
			.setDescription(`<@${toisolate.id}> has been moved to channel \`izolatka\``)
			.addField("Moved by", `<@${message.author.id}>`)
			.addField("Reason", reason);

		await(toisolate.addRole(isolaterole.id))
    		.catch(error => message.reply(`I couldn't isolate the user because: ${error}`));

    	message.channel.send(dmsEmbed);
	}
	if(command === "free") {
		if(message.channel.type !== 'text')
			return message.reply("I can't execute this command here!");
		if(!message.member.hasPermission("ADMINISTRATOR") && message.member.id.toString()!="623510473312043009")
			return message.reply("Sorry, you don't have permissions to do that!");
		let isolaterole = message.guild.roles.find(role => role.name === "AxelIsolate");
		let tofree = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(tofree.id==client.user.id)
			return message.reply("I can't free myself!");
		let tofreeid = tofree.id.toString();
		let yes=0;
		let messages = await client.channels.get(`690154190210596938`).fetchMessages();
		for (const [id, message] of messages) {
      		if(message.content==tofreeid)
      			message.delete();
      			yes=1;
    	}
    	if(yes==0)
    		return message.reply("this user has not been isolated!");

    	let dmsEmbed = new Discord.RichEmbed()
			.setTitle("Freedom")
			.setColor("#00ff00")
			.setDescription(`<@${tofree.id}> has been freed`)
			.addField("Freed by", `<@${message.author.id}>`);

		let izolatkachannel = client.channels.find(channel => channel.name === "izolatka");
    	await(tofree.removeRole(isolaterole.id))
    		.catch(error => message.reply(`I couldn't free the user because: ${error}`));
    	message.channel.send(dmsEmbed);
		let messages2 = await client.channels.get(`690154190210596938`).fetchMessages();
    	if(messages2.size==0){
	    	izolatkachannel.delete();
      	}
	}
	if(command === "votekick") {
		var time = "5m"
		let author=message.member.id.toString()
		if(message.channel.type !== 'text')
      		return message.reply("I can't execute this command here!");
      	
	  	let reason = args.slice(1).join(' ');
    	if (reason.length>1024) {
      		reason=reason.substring(0, 1020);
      		reason+="..."
    	}

    	

		let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(user.hasPermission("ADMINISTRATOR") || user.id.toString()=="623510473312043009" || user.id.toString()=="690150027242635265")
        	return message.reply("I can't kick this user! Do they have a higher role? Do I have kick permissions?");
		if (message.mentions.users.size < 1)
			return message.reply("please mention a valid member of this server!");
		if (reason.length < 1)
			reason = "None";
		var ilosc=1;
		var messages = await client.channels.get(`735937120144851015`).fetchMessages();
		for (let [id, message] of messages) {
			let messageArray = message.content.split(" ");
      		if(messageArray[0].toString()==user.id.toString() && messageArray[1].toString()==author)
      			return;
      		if(messageArray[0].toString()==user.id.toString())
      			ilosc+=1
    	}
    	if(ilosc==5) {
    		for (let [id, message] of messages) {
				let messageArray = message.content.split(" ");
	      		if(messageArray[0].toString()==user.id.toString())
	      			message.delete();
    		}
      		await user.kick(reason)
        		.catch(error => message.reply(`I couldn't kick the user because: ${error}`));

        	let dmsEmbed = new Discord.RichEmbed()
	  			.setTitle("Votekick")
	  			.setColor("#8a2be2")
	  			.setDescription(`\`${user.user.tag}\` has been kicked from \`${message.guild.name}\``)
	  			.addField("Kicked by", `Votekick`)

	  		let dmsEmbed2 = new Discord.RichEmbed()
				.setTitle("Votekick")
				.setColor("#8a2be2")
				.setDescription(`You have been kicked from \`${message.guild.name}\``)
				.addField("Kicked by", `Votekick`)

			message.channel.send(dmsEmbed);
			user.send(dmsEmbed2);
      	} else {
			client.channels.get(`735937120144851015`).send(user.id.toString() + " " + author);
			let dmsEmbed = new Discord.RichEmbed()
				.setTitle("Votekick")
				.setColor("#8a2be2")
				.setDescription(`<@${user.id}> has been nominated to be kicked from \`${message.guild.name}\`. The vote will expire after 5 minutes.`)
				.addField("Number of votes:", ilosc + "/5")
				.addField("Voted by", `<@${message.author.id}>`)
				.addField("Reason", reason);

			message.channel.send(dmsEmbed);

			setTimeout(function(){
				client.channels.get(`735937120144851015`).fetchMessages().then((messages) => {
					for (let [id, message] of messages) {
						let messageArray = message.content.split(" ");
		      			if(messageArray[0].toString()==user.id.toString() && messageArray[1].toString()==author)
		      				message.delete();
		    		}
		    	});
		    	message.reply("your vote has expired.");
    		}, ms(time));
      	}
    	
	}
});

client.login(config.token);