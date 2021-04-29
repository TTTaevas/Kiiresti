module.exports = message => {

	const Discord = require('discord.js')

	const msg = message.content.split(" ")
	const commands = ["help", "user", "recent", "compare", "top"]

	if (msg.length <= 2) {
		message.reply("wip sry")
	} else {
		for (let i = 2; i < msg.length; i++) {
			for (let e = 0; e < commands.length; e++) {
				if (msg[i].toLowerCase() == commands[e]) {

					let to_send = new Discord.MessageEmbed({
						color: "#3399ff"
					})
					to_send.setTitle(`How to use: ${prefix} ${commands[e]}`)

					switch(commands[e]) {
						case "help":
							to_send.setDescription(`**"${prefix} help" helps you out with using my commands!**`)
							to_send.addField(`${prefix} help`, `Tells you about all the available commands, as well as how to use them.`)
							to_send.addField(`${prefix} help top`, `Tells you all you need to know about the "${prefix} top" command, with examples.`)
							to_send.addField(`${prefix} help user compare`, `Tells you all you need to know about the "${prefix} user" command.\nAlso tells you about "${prefix} compare".`)
							break

						case "user":
							to_send.setDescription(`**"${prefix} user" associates your Discord account with a *speedrun.com* user!\nThat way, you don't need to use arguments for certain commands.**`)
							to_send.addField(`${prefix} user Taevas`, `Associates your account to *speedrun.com* user "Taevas".\nThen, you can simply use "${prefix} recent" to get their most recent run!`)
							break

						case "recent":
							to_send.setDescription(`**"${prefix} recent" allows you to get the most recent run of a user!\nIt also allows you to get that user's obsolete times on the same game.**`)
							to_send.addField(`${prefix} recent`, `Gets the most recent run of the *speedrun.com* user your Discord account is associated with.\nYou can associate stuff with "${prefix} user".`)
							to_send.addField(`${prefix} recent Taevas`, `Gets the most recent run of the *speedrun.com* user "Taevas".`)
							to_send.addField(`${prefix} recent @${message.author.username}`, `Gets the most recent run of the *speedrun.com* user that is associated with ${message.author.tag}'s Discord account.`)
							break

						case "compare":
							to_send.setDescription(`**"${prefix} compare" gets a user's personal best on the same game as the one previously shown on the same text channel.\nIf someone does "${prefix} recent", and that it shows a run on SM64, "${prefix} compare" will get a user's run on SM64!**`)
							to_send.addField(`${prefix} compare`, `Gets the personal best of the *speedrun.com* user your Discord account is associated with on the game last shown in the channel.\nYou can associate stuff with "${prefix} user".`)
							to_send.addField(`${prefix} compare Taevas`, `Gets the personal best of the *speedrun.com* user "Taevas" on the game last shown in the channel.`)
							to_send.addField(`${prefix} compare @${message.author.username}`, `Gets the personal best of the *speedrun.com* user that is associated with ${message.author.tag}'s Discord account on the game last shown in the channel.`)
							break

						case "top":
							to_send.setDescription(`**"${prefix} top" gets the top 10 best runs on a game, category or level!\nThis command works differently from others due to its complexity.**\n\nUse:\n"-g" to specify a game\n"-c" to specify a category\n"-s" to specify a sub-category\n"-l" to specify a level\n**Any order works.**`)
							to_send.addField(`${prefix} top`, `Gives you the top 10 runs on the game/category/sub-category/level last shown in the channel.`)
							to_send.addField(`${prefix} top -g TMNF`, `Gives you the top 10 runs on the first category of the game Trackmania Nations Forever, which happens to be "White".`)
							to_send.addField(`${prefix} top -g Super Mario 64 -c 120 Star`, `Gives you the top 10 runs on the "120 Star" category of Super Mario 64, across all sub-categories.`)
							to_send.addField(`${prefix} top -g Super Mario 64 -c 70 Star -s EMU`, `Gives you the top 10 runs on the "70 Star" category of Super Mario 64, of the "EMU" sub-category.`)
							to_send.addField(`${prefix} top -g Seterra -l Among Us The Skeld -c Website`, `Gives you the top 10 runs on the "Website" category of the "Among Us The Skeld" level of Seterra.`)
							break
					}

					message.channel.send(to_send)

				}
			}
			if (i == commands.length + 2) {i = msg.length} // Prevents bot from spamming due to a big help command
		}
	}

}
