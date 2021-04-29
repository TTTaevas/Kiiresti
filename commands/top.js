module.exports = message => {

	const get = require('../functions/get.js')
	const fs = require('fs')

	id = Math.floor((Math.random() * 999999) + 1)
	let currentDate = new Date()
	console.log(`\n---------${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${id}---------`)

	let msg = message.content.split(" ")
	if (msg.length == 2) { // Get the top runs for the last game/category shown on this channel

		if (!fs.existsSync("./last_runs.json")) {return message.channel.send(`${message.author} You should tell me what's the game you want to see runs from...`)}

		let last_runs_promise = new Promise((resolve, reject) => {
			fs.readFile("./last_runs.json", function(error, data) {
				if (error) {throw error}
				resolve(JSON.parse(data))
			})
		})
		.then((last_runs) => {

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

			if (!exists) {return message.channel.send(`${message.author} You should tell me what's the game you want to see runs from...`)}

			find_top_scores(message, game, category, sub_category)
		})

	} else { // Get the top runs for the game & category given as arguments
		
		let game_title = msg[2].replace(/_/g, " ")

		let game_promise = new Promise((resolve, reject) => {resolve(get("games", `name=${game_title}&embed=categories`))})
		.then((game) => {

			if (game.length <= 0) {return message.channel.send(`${message.author} My apologies, but I couldn't find the game "${game_title}"...`)}

			game = game[0]
			var category

			if (msg.length >= 4) {
				let categories = game.categories.data
				let cat_exists = false

				for (let i = 0; i < categories.length; i++) {
					if (msg[3].replace(/_/g, " ") == categories[i].name) {
						category = categories[i]
						cat_exists = true
						i = categories.length
					}
				}

				if (!cat_exists) {return message.channel.send(`${message.author} The category you specified doesn't seem to exist!`)}
					
			} else {
				category = game.categories.data[0] // Just pick the first category if the user didn't specify one
			}

			let sub_cat_promise = new Promise((resolve, reject) => {resolve(get(`categories/${category.id}/variables`, ``))})
			.then((details) => {

				var sub_category = [undefined, undefined]
				var objective = msg.length >= 5 ? msg[4].replace(/_/g, " ") : false

				for (let i = 0; i < details.length; i++) {
					if (details[i]["is-subcategory"]) {
						let values = details[i].values.values
						if (!objective) {
							sub_category[0] = Object.keys(values)[0]
							sub_category[1] = Object.values(values)[0].label
							i = details.length
						} else {
							for (let e = 0; e < values.length; e++) {
								if (values[e].label == objective) {
									sub_category[0] = Object.keys(values)[e]
									sub_category[1] = Object.values(values)[e].label
									i = details.length
								}
							}
						}
					}
				}

				find_top_scores(message, game.id, category.id, sub_category)

			})
		})
	}
}

function find_top_scores(message, game, category, sub_category) {
	const get = require('../functions/get.js')

	let leaderboard_promise = new Promise((resolve, reject) => {resolve(get(`leaderboards/${game}/category/${category}`, `embed=players`))})
	.then((leaderboard) => { // Get ALL the runs on the game & category
		// It is truly a large amount of data for certain cases, but using "top" to limit the data is useless in our case
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

			leaderboard.runs = leaderboard.runs.filter(function(i) {return i != undefined})
			leaderboard.players.data = leaderboard.players.data.filter(function(i) {return i != undefined})
		}

		if (leaderboard.runs.length <= 0) {return message.channel.send(`${message.author} It doesn't seem like any run was made for that...`)}

		let game_promise = new Promise((resolve, reject) => {resolve(get(`games/${game}`, `embed=categories`))})
		.then((game) => {
			let categories = game.categories.data

			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id == category) {
					embed_top(message, leaderboard, game, categories[i], sub_category)
					i = categories.length
				}
			}
		})
	})
}

function embed_top(message, top, game, category, sub_category) {
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

	message.channel.send(to_send)
}
