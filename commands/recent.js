module.exports = message => {

	const get = require('../functions/get.js')
	const msg = message.content.split(" ")

	let user_promise = new Promise((resolve, reject) => {resolve(discord_user(msg, message))})
	.then((user) => {
		
		if (!user) {return message.reply("you have not yet associated your Discord account to a speedrun.com account!")}

		id = Math.floor((Math.random() * 999999) + 1) // If multiple requests are made at the same time, and one of them glitches out: better logging
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
			const id = user_info.id

			let recent_all_promise = new Promise((resolve, reject) => {resolve(get("runs", `?user=${id}&orderby=date&direction=desc`))})
			.then((recent_all) => { // Get the user's recent runs

				if (recent_all.length <= 0) {return message.channel.send(`${message.author} ${user_info.names.international} doesn't seem to have made any run yet...`)}
				let run = recent_all[0]

				// Get the user's other runs on the same game as the most recent one; needed for the embed's fields
				let recent_promise = new Promise((resolve, reject) => {resolve(get("runs", `?user=${id}&game=${run.game}&category=${run.category}&orderby=date&direction=desc`))})
				// Get the game; needed for the embed's thumbnail
				let game_promise = new Promise((resolve, reject) => {resolve(get("games", `/${run.game}`))})
				// Get the run's game's category; needed for the embed's title
				let category_promise = new Promise((resolve, reject) => {resolve(get("categories", `/${run.category}`))})
				// Get the run's details; needed for the embed's description
				let sub_cat_promise = new Promise((resolve, reject) => {resolve(get("categories", `/${run.category}/variables`))})

				Promise.all([recent_promise, game_promise, category_promise, sub_cat_promise])
				.then((values) => {embed(message, run, user_info, values[0], values[1], values[2], values[3])})

			})

		})

	})

}

function embed(message, run, user, recent, game, category, sub_cat) {
	const Discord = require('discord.js')

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
		if (i >= 24) {i = recent.length} // Number of fields is limited to 25, according to Discord.js documentation
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

function run_time(time) {
	time = time.replace("PT", "")
	if (time.indexOf("H") != -1) {time = time.charAt(time.indexOf("H") + 2) == "M" ? time.replace("H", ":0") : time.replace("H", ":")}
	if (time.indexOf("M") != -1) {time = time.charAt(time.indexOf("M") + 2) == "." ? time.replace("M", ":0") : time.replace("M", ":")}
	time = time.replace("S", "")
	return time
}

async function discord_user(msg, message) {
	const fs = require('fs')
	var user

	if (msg.length >= 3) {return msg[2]}

	if (!fs.existsSync("./database.json")) {return undefined}

	let database_promise = await new Promise((resolve, reject) => {
		fs.readFile("./database.json", function(error, data) {
			if (error) {throw error}
			resolve(JSON.parse(data))
		})
	})
	.then((database) => {
		let keys = Object.keys(database)
		let vals = Object.values(database)

		for (let i = 0; i < keys.length; i++) {
			if (keys[i] == message.author.id) {
				user = vals[i]
			}
		}

	})

	return user
}
