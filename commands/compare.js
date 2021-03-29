module.exports = message => {

	const fs = require('fs')
	const get = require('../functions/get.js')
	const discord_user = require('../functions/discord_user.js')
	const embed_normal = require('../functions/embed_normal.js')
	const msg = message.content.split(" ")

	if (!fs.existsSync("./last_runs.json")) {return message.channel.send(`${message.author} There is no run to compare in this channel!`)}

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

		if (!exists) {return message.channel.send(`${message.author} There is no run to compare in this channel!`)}

		let user_promise = new Promise((resolve, reject) => {resolve(discord_user(message.content.split(" "), message))})
		.then((user) => {
			
			if (!user) {return message.reply("you have not yet associated your Discord account to a speedrun.com account!")}

			id = Math.floor((Math.random() * 999999) + 1)
			let currentDate = new Date()
			console.log(`\n---------${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${id}---------`)

			var user_info
			var run

			// FIRST GET THE USER
			// SECOND GET THEIR RECENT RUN ON THE GAME & CATEGORY
			// THIRD GET EVERYTHING ELSE

			let speedrun_user_promise = new Promise((resolve, reject) => {resolve(get("users", `?lookup=${user}`))})
			.then((speedrun_user) => { // Get the user's id, required to get the user's runs
				
				for (let i = 0; i < speedrun_user.length; i++) {if (speedrun_user[i].names.international == user) {user_info = speedrun_user[i]}}
				if (user_info == undefined) {return message.channel.send(`${message.author} I may be blind, but ${user} doesn't seem to exist...`)}

				let recent_promise = new Promise((resolve, reject) => {resolve(get("runs", `?user=${user_info.id}&game=${game}&category=${category}&orderby=date&direction=desc`))})
				.then((recent) => { // Get the user's runs on this specific game & category

					if (recent.length <= 0) {return message.channel.send(`${message.author} ${user_info.names.international} doesn't seem to have made any run on this game/in this category yet...`)}
					let run = recent[0]

					// Get the game; needed for the embed's thumbnail
					let game_promise = new Promise((resolve, reject) => {resolve(get("games", `/${run.game}`))})
					// Get the run's game's category; needed for the embed's title
					let category_promise = new Promise((resolve, reject) => {resolve(get("categories", `/${run.category}`))})
					// Get the run's details; needed for the embed's description
					let sub_cat_promise = new Promise((resolve, reject) => {resolve(get("categories", `/${run.category}/variables`))})

					Promise.all([game_promise, category_promise, sub_cat_promise])
					.then((values) => {
						embed_normal(message, run, user_info, recent, values[0], values[1], values[2])
					})

				})

			})

		})
	})
}
