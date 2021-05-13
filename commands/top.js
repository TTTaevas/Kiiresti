module.exports = async (message, id) => {

	const get = require('../functions/get.js')
	const fs = require('fs')

	return await new Promise(async (resolve, reject) => {

		let msg = message.content.split(" ")
		if (msg.length == 2) { // Get the top runs for the last game/category shown on this channel

			if (!fs.existsSync("./data/last_runs.json")) {
				message.channel.send(`${message.author} You should tell me what's the game you want to see runs from...`)
				return resolve(`Could not top, there is no game in the data`)
			}
			let last_runs = await JSON.parse(await fs.promises.readFile("./data/last_runs.json"))

			var game
			var category
			var sub_category
			let exists = false

			for (let i = 0; i < last_runs.length; i++) {
				if (last_runs[i].channel == message.channel) {
					game = last_runs[i].game
					category = last_runs[i].category
					sub_category = [last_runs[i].sub_category, last_runs[i].sub_category_name]
					exists = true
					i = last_runs.length
				}
			}

			if (!exists) {
				message.channel.send(`${message.author} You should tell me what's the game you want to see runs from...`)
				return resolve(`Could not top, no run in channel ${message.channel}`)
			}

			await find_top_scores(message, game, category, sub_category, id)

		} else { // Get the top runs for the game & category given as arguments
			
			let game_stuff = ["", "", "", ""] // [GAME, CATEGORY, SUBCATEGORY, LEVEL]
			let what_game_stuff = -1

			for (let i = 0; i < msg.length; i++) {

				if (/-[a-z]/g.test(msg[i]) && msg[i].length == 2) {what_game_stuff = -1}

				if (what_game_stuff != -1) {game_stuff[what_game_stuff] += `${msg[i].toLowerCase()} `}

				if (msg[i] == "-g") {what_game_stuff = 0}
				if (msg[i] == "-c") {what_game_stuff = 1}
				if (msg[i] == "-s") {what_game_stuff = 2}
				if (msg[i] == "-l") {what_game_stuff = 3}

				if (i + 1 == msg.length) {
					for (let e = 0; e < game_stuff.length; e++) {
						if (game_stuff[e].length > 0) {game_stuff[e] = game_stuff[e].substring(0, game_stuff[e].length - 1)}
					}
				}

			}

			let game = await get("games", `name=${game_stuff[0]}&embed=categories`, id)

			if (game.length <= 0) {
				message.channel.send(`${message.author} My apologies, but I couldn't find the game "${game_stuff[0]}"...`)
				return resolve(`Could not top, specified game doesn't exist`)
			}
			game = game[0]
			
			var category

			if (game_stuff[1].length > 0) {
				let categories = game.categories.data
				let cat_exists = false

				for (let i = 0; i < categories.length; i++) {
					if (game_stuff[1] == categories[i].name.toLowerCase()) {
						category = categories[i]
						cat_exists = true
						i = categories.length
					}
				}

				if (!cat_exists) {
					message.channel.send(`${message.author} The category you specified doesn't seem to exist!`)
					return resolve(`Could not top, specified category doesn't exist`)
				}
						
			} else {
				category = game.categories.data[0] // Just pick the first category if the user didn't specify one
			}

			let details = await get(`categories/${category.id}/variables`, ``, id)

			var sub_category = [undefined, undefined]
			var objective = game_stuff[2].length > 0 ? game_stuff[2] : false

			for (let i = 0; i < details.length; i++) {
				if (details[i]["is-subcategory"]) {
					let values = details[i].values.values
					if (!objective) {
						sub_category[0] = Object.keys(values)[0]
						sub_category[1] = Object.values(values)[0].label
						i = details.length
					} else {
						for (let e = 0; e < Object.keys(values).length; e++) {
							if (Object.values(values)[e].label.toLowerCase() == objective) {
								sub_category[0] = Object.keys(values)[e]
								sub_category[1] = Object.values(values)[e].label
								i = details.length
							}
						}
					}
				}
			}

			await find_top_scores(message, game.id, category.id, sub_category, id)

		}

		return resolve(`Sent the leaderboards!`)

	})

}

async function find_top_scores(message, game, category, sub_category, id) {
	const get = require('../functions/get.js')

	let leaderboard = await get(`leaderboards/${game}/category/${category}`, `embed=players`, id)
	// Get ALL the runs on the game & category
	// It is truly a large amount of data for certain cases, but using "top" argument to limit the data is useless in our case
	// If a category has a lot of runs, and the target sub category takes the longest time to run,
	// then using "top" would indirectly remove the runs of the target sub category from the data

	if (sub_category[0] && sub_category[0] != "undefined") {
		for (let e = 0; e < leaderboard.runs.length; e++) {
			let to_keep = false

			for (let o = 0; o < Object.values(leaderboard.runs[e].run.values).length; o++) {
				if (sub_category[0] == Object.values(leaderboard.runs[e].run.values)[o]) {to_keep = true}
			}

			if (!to_keep) {
				leaderboard.runs[e] = undefined
				leaderboard.players.data[e] = undefined
			}
		}
	}

	leaderboard.runs = leaderboard.runs.filter(function(i) {return i != undefined})
	leaderboard.players.data = leaderboard.players.data.filter(function(i) {return i != undefined})

	if (leaderboard.runs.length <= 0) {return message.channel.send(`${message.author} It doesn't seem like any run was made for that...`)}

	let game_2 = await get(`games/${game}`, `embed=categories`, id)
	let categories = game_2.categories.data

	for (let i = 0; i < categories.length; i++) {
		if (categories[i].id == category) {
			await embed_top(message, leaderboard, game_2, categories[i], sub_category)
			i = categories.length
		}
	}
}

async function embed_top(message, top, game, category, sub_category) {
	const Discord = require('discord.js')
	const run_time = require('../functions/run_time.js')

	const to_send = new Discord.MessageEmbed({
		title: `World Record in ${run_time(top.runs[0].run.times.primary)} by ${top.players.data[0].names.international}`,
		url: top.runs[0].run.weblink,
		color: "#000000"
	})
	.setThumbnail(game.assets['cover-medium'].uri) // Can't use "thumbnail" directly for some reason???

	if (sub_category[1] && sub_category[1] != "undefined") {
		to_send.setAuthor(`Top 10 runs on ${game.names.international} (${category.name} - ${sub_category[1]})`, '', category.weblink)
	} else {
		to_send.setAuthor(`Top 10 runs on ${game.names.international} (${category.name})`, '', category.weblink)
	}

	for (let i = 1; i < top.runs.length; i++) {
		if (top.players.data[i].rel == "user") {
			to_send.addField(`#${i + 1}: ${top.players.data[i].names.international} | ${run_time(top.runs[i].run.times.primary)}`, top.runs[i].run.weblink)
		} else {
			to_send.addField(`#${i + 1}: ${top.players.data[i].name} | ${run_time(top.runs[i].run.times.primary)}`, top.runs[i].run.weblink)
		}
		if (i >= 9) {i = top.runs.length} // Only top 10
	}

	await message.channel.send(to_send)
}
