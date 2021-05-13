module.exports = async (message, id) => {

	const get = require('../functions/get.js')
	const discord_user = require('../functions/discord_user.js')
	const treat_details = require('../functions/treat_details.js')
	const embed_normal = require('../functions/embed_normal.js')

	return await new Promise(async (resolve, reject) => {

		let user = await discord_user(message.content.split(" "), message)
			
		if (!user) {
			message.reply("you have not yet associated your Discord account to a speedrun.com account!")
			return resolve(`Could not recent, no user associated to ${message.author} / ${message.author.tag}`)
		}

		var user_info

		let speedrun_user = await get("users", `lookup=${user}`, id)
				
		for (let i = 0; i < speedrun_user.length; i++) {if (speedrun_user[i].names.international == user) {user_info = speedrun_user[i]}}
		if (user_info == undefined) {
			message.channel.send(`${message.author} I may be blind, but ${user} doesn't seem to exist...`)
			return resolve(`Could not recent, specified user (${user}) doesn't exist`)
		}

		let recent_all = await get("runs", `user=${user_info.id}&orderby=date&direction=desc`, id)

		if (recent_all.length <= 0) {
			message.channel.send(`${message.author} ${user_info.names.international} doesn't seem to have made any run yet...`)
			return resolve(`Could not recent, user (${user_info.names.international}) has not made any run`)
		}
		let run = recent_all[0]

		let recent_promise = new Promise((resolve, reject) => {resolve(get("runs", `user=${user_info.id}&game=${run.game}&category=${run.category}&orderby=date&direction=desc`, id))})
		let game_promise = new Promise((resolve, reject) => {resolve(get(`games/${run.game}`, `embed=categories.variables`, id))})

		let values = await Promise.all([recent_promise, game_promise])

		let categories = values[1].categories.data
		var category

		for (let e = 0; e < categories.length; e++) {
			if (categories[e].id == run.category) {
				category = categories[e]
				e = categories.length
			}
		}

		let details = treat_details(run.values, category.variables.data)

		await embed_normal(message, run, user_info, values[0], values[1], category, details)
		await store(message.channel.id, run.game, run.category, details[1].id, details[1].name, id)
		return resolve(`Sent the user's most recent run!`)

	})

}

async function store(channel, game, category, sub_category, sub_category_name, id) { // Stores the last run on the channel so it can be compared to by users
	const check_data = require('../functions/check_data.js')
	const fs = require('fs')

	await check_data("last_runs.json", id)
	let last_runs = await JSON.parse(await fs.promises.readFile("./data/last_runs.json"))

	let exists = false

	for (let i = 0; i < last_runs.length; i++) {
		if (last_runs[i].channel == channel) {
			last_runs[i].game = game
			last_runs[i].category = category
			last_runs[i].sub_category = sub_category
			last_runs[i].sub_category_name = sub_category_name // Currently only useful for the >ki top command
			console.log(`(${id}) Channel ${channel} has been UPDATED in the last_runs file`)
			exists = true
			i = last_runs.length
		}
	}

	last_runs = await JSON.stringify(last_runs)

	if (!exists) {
		if (last_runs.charAt(last_runs.length - 2) == "}") {
		last_runs = `${last_runs.substring(0, last_runs.length - 1)},{"channel": "${channel}","game": "${game}","category": "${category}","sub_category": "${sub_category}","sub_category_name": "${sub_category_name}"}]`
		} else {
			last_runs = `${last_runs.substring(0, last_runs.length - 1)}{"channel": "${channel}","game": "${game}","category": "${category}","sub_category": "${sub_category}","sub_category_name": "${sub_category_name}"}]`
		}
		console.log(`(${id}) Channel ${channel} has been ADDED to the last_runs file`)
	}

	fs.writeFile("./data/last_runs.json", last_runs, function(error) {if (error) {throw error}})

}
