// THIS FUNCTION SERVES TO SEND NORMAL EMBED MESSAGES

module.exports = function embed_normal(message, run, user, recent, game, category, sub_cat) {
	const Discord = require('discord.js')
	const run_time = require('../functions/run_time.js')

	const to_send = new Discord.MessageEmbed({
		author: {
			name: `Latest run by ${user.names.international}, made the ${run.date}`,
			url: user.weblink
		},
		title: `${game.names.international} (${category.name}) in ${run_time(run.times.primary)}`,
		url: run.weblink,
		color: user['name-style']['color-from'].light
	})
	.setThumbnail(game.assets['cover-medium'].uri) // Can't use "thumbnail" directly for some reason???

	for (let i = 0; i < recent.length; i++) {
		if (recent[i].game == run.game && recent[i].category == run.category && recent[i].id != run.id) {
			to_send.addField(`Previous time from ${recent[i].date}`, `${run_time(recent[i].times.primary)} | ${recent[i].weblink}`)
		}
		if (i >= 15) {i = recent.length} // Number of fields is apparently limited to 25, but 15 is already big enough
	}

	let description = ""
	for (let i = 0; i < Object.keys(run.values).length; i++) {
		for (let o = 0; o < Object.keys(sub_cat).length; o++) {
			for (let e = 0; e < Object.keys(sub_cat[o].values.values).length; e++) {
				if (Object.values(run.values)[i] == Object.keys(sub_cat[o].values.values)[e]) {
					description += sub_cat[o].name + ": "
					description += String(Object.values(sub_cat[o].values.values)[e].label) + "\n"
				}
			}
		}
	}
	to_send.setDescription(description)

	message.channel.send(to_send)
}
