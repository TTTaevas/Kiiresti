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

			let exists = false
			var game
			var category

			for (let i = 0; i < last_runs.length; i++) {
				if (last_runs[i].channel == message.channel) {
					game = last_runs[i].game
					category = last_runs[i].category
					exists = true
					i = last_runs.length
				}
			}

			if (!exists) {return message.channel.send(`${message.author} You should tell me what's the game you want to see runs from...`)}

			find_top_scores(message, game, category)
		})

	} else { // Get the top runs for the game & category given as arguments
		
		let game_title = msg[2].replace(/_/g, " ")

		let game_promise = new Promise((resolve, reject) => {resolve(get("games", `?name=${game_title}&embed=categories`))})
		.then((game) => {

			if (game.length <= 0) {return message.channel.send(`${message.author} My apologies, but I couldn't find the game "${game_title}"...`)}
			game = game[0]
			var category

			if (msg.length == 4) {
				let categories = game.categories.data
				let exists = false

				for (let i = 0; i < categories.length; i++) {
					if (msg[3].replace(/_/g, " ") == categories[i].name) {
						category = categories[i]
						exists = true
						i = categories.length
					}
				}

				if (!exists) {return message.channel.send(`${message.author} The category you specified doesn't seem to exist!`)}
			} else {
				category = game.categories.data[0] // Just pick the first category if the user didn't specify one
			}

			find_top_scores(message, game.id, category.id)
		})
	}
}

function find_top_scores(message, game, category) {
	const get = require('../functions/get.js')

	let leaderboard_promise = new Promise((resolve, reject) => {resolve(get("leaderboards", `/${game}/category/${category}?top=10&embed=players`))})
	.then((leaderboard) => { // Get the top 10 runs on the game & category

		if (leaderboard.runs.length <= 0) {return message.channel.send(`${message.author} It doens't seem like any run was made for that...`)}

		let game_promise = new Promise((resolve, reject) => {resolve(get("games", `/${game}?embed=categories`))})
		.then((game) => {
			let categories = game.categories.data

			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id == category) {
					embed_top(message, leaderboard, game, categories[i])
					i = categories.length
				}
			}
		})
	})
}

function embed_top(message, top, game, category) {
	const Discord = require('discord.js')
	const run_time = require('../functions/run_time.js')

	const to_send = new Discord.MessageEmbed({
		author: {
			name: `Top 10 runs on ${game.names.international} (${category.name})`,
			url: category.weblink
		},
		title: `World Record in ${run_time(top.runs[0].run.times.primary)} by ${top.players.data[0].names.international}`,
		url: top.runs[0].run.weblink,
		color: "#000000"
	})
	.setThumbnail(game.assets['cover-medium'].uri) // Can't use "thumbnail" directly for some reason???

	for (let i = 1; i < top.runs.length; i++) {
		to_send.addField(`#${i + 1}: ${top.players.data[i].names.international} | ${run_time(top.runs[i].run.times.primary)}`, top.runs[i].run.weblink)
		if (i >= 9) {i = top.runs.length} // Only top 10
	}

	message.channel.send(to_send)
}
