// THIS FUNCTION SERVES TO SEND NORMAL EMBED MESSAGES

module.exports = function embed_normal(message, run, user, recent, game, category, level, details) {
	const Discord = require('discord.js')
	const run_time = require('../functions/run_time.js')
	const treat_details = require('../functions/treat_details.js')

	const to_send = new Discord.MessageEmbed({
		author: {
			name: `Latest run by ${user.names.international}, made the ${run.date}`,
			url: user.weblink
		},
		url: run.weblink,
		color: user['name-style']['color-from'].light
	})
	.setThumbnail(game.assets['cover-medium'].uri) // Can't use "thumbnail" directly for some reason???

	let title = `${game.names.international} (`
	if (level) {title += `${level.name}, `}
	title +=  `${category.name}`
	title += details[1] ? ` - ${details[1].name})` : ")"
	title += ` in ${run_time(run.times.primary)}`
	to_send.setTitle(title)

	let field_number = 0

	for (let i = 0; i < recent.length; i++) {
		if (recent[i].game == run.game && recent[i].category == run.category && recent[i].id != run.id) {
			if (details[1]) { // Make sure the runs are in the same sub-category
				let recent_details = treat_details(recent[i].values, category.variables.data)
				if (recent_details[1].id == details[1].id) {
					to_send.addField(`Previous time from ${recent[i].date}`, `${run_time(recent[i].times.primary)} | ${recent[i].weblink}`)
					field_number++
				}
			} else {
				to_send.addField(`Previous time from ${recent[i].date}`, `${run_time(recent[i].times.primary)} | ${recent[i].weblink}`)
				field_number++
			}
		}
		if (field_number >= 10) {i = recent.length} // Number of fields is apparently limited to 25, but 10 is already big enough
	}

	let description = ""

	for (let i = 0; i < details[0].length; i++) {
		description = description + `${details[0][i].name}: ${details[0][i].choice}\n`
	}

	to_send.setDescription(description)

	message.channel.send(to_send)
}
