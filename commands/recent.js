module.exports = message => {
	const get = require('../functions/get.js')
	const discord_user = require('../functions/discord_user.js')
	const treat_details = require('../functions/treat_details.js')
	const embed_normal = require('../functions/embed_normal.js')

	let user_promise = new Promise((resolve, reject) => {resolve(discord_user(message.content.split(" "), message))})
	.then((user) => {
		
		if (!user) {return message.reply("you have not yet associated your Discord account to a speedrun.com account!")}

		id = Math.floor((Math.random() * 999999) + 1)
		let currentDate = new Date()
		console.log(`\n---------${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${id}---------`)

		var user_info
		var run

		// FIRST GET THE USER
		// SECOND GET THEIR RECENT RUNS
		// THIRD GET EVERYTHING ELSE

		let speedrun_user_promise = new Promise((resolve, reject) => {resolve(get("users", `?lookup=${user}`))})
		.then((speedrun_user) => { // Get the user's id, required to get the user's recent runs
			
			for (let i = 0; i < speedrun_user.length; i++) {if (speedrun_user[i].names.international == user) {user_info = speedrun_user[i]}}
			if (user_info == undefined) {return message.channel.send(`${message.author} I may be blind, but ${user} doesn't seem to exist...`)}

			let recent_all_promise = new Promise((resolve, reject) => {resolve(get("runs", `?user=${user_info.id}&orderby=date&direction=desc`))})
			.then((recent_all) => { // Get the user's recent runs

				if (recent_all.length <= 0) {return message.channel.send(`${message.author} ${user_info.names.international} doesn't seem to have made any run yet...`)}
				let run = recent_all[0]

				// Get the user's other runs on the same game as the most recent one; needed for the embed's fields
				let recent_promise = new Promise((resolve, reject) => {resolve(get("runs", `?user=${user_info.id}&game=${run.game}&category=${run.category}&orderby=date&direction=desc`))})
				// Don't get the category directly, because the game has important data, such as the embed's thumbnail
				let game_promise = new Promise((resolve, reject) => {resolve(get("games", `/${run.game}?embed=categories.variables`))})

				Promise.all([recent_promise, game_promise])
				.then((values) => {

					// Deal with the category
					let categories = values[1].categories.data
					var category

					for (let e = 0; e < categories.length; e++) {
						if (categories[e].id == run.category) {
							category = categories[e]
							e = categories.length
						}
					}

					let details = treat_details(run.values, category.variables.data)

					embed_normal(message, run, user_info, values[0], values[1], category, details)
					store(message.channel.id, run.game, run.category, details[1].id)

				})

			})

		})

	})

}

function store(channel, game, category, sub_category) { // Stores the last run on the channel so it can be compared to by users
	const fs = require('fs')

	if (!fs.existsSync("./last_runs.json")) {
		fs.writeFile("./last_runs.json", '[]', function(error) {
			if (error) {throw error}
			console.log(`(${id}) The last_runs file has been created!`)
		})
	}

	let last_runs_promise = new Promise((resolve, reject) => {
		fs.readFile("./last_runs.json", function(error, data) {
			if (error) {throw error}
			resolve(JSON.parse(data))
		})
	})
	.then((last_runs) => {

		let exists = false

		for (let i = 0; i < last_runs.length; i++) {
			if (last_runs[i].channel == channel) {
				last_runs[i].game = game
				last_runs[i].category = category
				last_runs[i].sub_category = sub_category
				console.log(`(${id}) Channel ${channel} has been UPDATED in the last_runs file`)
				exists = true
				i = last_runs.length
			}
		}

		last_runs = JSON.stringify(last_runs)

		if (!exists) {
			if (last_runs.charAt(last_runs.length - 2) == "}") {
				last_runs = `${last_runs.substring(0, last_runs.length - 1)},{"channel": "${channel}","game": "${game}","category": "${category}","sub_category": "${sub_category}"}]`
			} else {
				last_runs = `${last_runs.substring(0, last_runs.length - 1)}{"channel": "${channel}","game": "${game}","category": "${category}","sub_category": "${sub_category}"}]`
			}
			console.log(`(${id}) Channel ${channel} has been ADDED to the last_runs file`)
		}

		fs.writeFile("./last_runs.json", last_runs, function(error) {if (error) {throw error}})
	})
}
