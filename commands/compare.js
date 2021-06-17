module.exports = async (message, id) => {

	const fs = require('fs')
	const get = require('../functions/get.js')
	const discord_user = require('../functions/discord_user.js')
	const treat_details = require('../functions/treat_details.js')
	const embed_normal = require('../functions/embed_normal.js')
	const msg = message.content.split(" ")

	return await new Promise(async (resolve, reject) => {

		if (!fs.existsSync("./data/last_runs.json")) {
			message.channel.send(`${message.author} There is no run to compare in this channel!`)
			return resolve("Could not compare, no run recorded in data")
		}

		let last_runs = await JSON.parse(await fs.promises.readFile("./data/last_runs.json"))

		var last_game
		var last_category
		var last_sub_category
		var last_level
		let exists = false

		for (let i = 0; i < last_runs.length; i++) {
			if (last_runs[i].channel == message.channel) {
				last_game = last_runs[i].game
				last_category = last_runs[i].category
				last_sub_category = last_runs[i].sub_category
				last_level = last_runs[i].level
				exists = true
				i = last_runs.length
			}
		}

		if (!exists) {
			message.channel.send(`${message.author} There is no run to compare in this channel!`)
			return resolve(`Could not compare, no run in channel ${message.channel}`)
		}

		let user = await discord_user(message.content.split(" "), message)
				
		if (!user) {
			message.reply("you have not yet associated your Discord account to a speedrun.com account!")
			return resolve(`Could not compare, no user associated to ${message.author} / ${message.author.tag}`)
		}

		var user_info
		let speedrun_user = await get("users", `lookup=${user}`, id)
					
		for (let i = 0; i < speedrun_user.length; i++) {if (speedrun_user[i].names.international == user) {user_info = speedrun_user[i]}}
		if (user_info == undefined) {
			message.channel.send(`${message.author} I may be blind, but ${user} doesn't seem to exist...`)
			return resolve(`Could not compare, specified user (${user}) doesn't exist`)
		}

		let recent = await get("runs", `user=${user_info.id}&game=${last_game}&category=${last_category}&orderby=date&direction=desc`, id)

		let temp_arr = []
		for (let e = 0; e < recent.length; e++) {
			if (last_sub_category != undefined && Object.values(recent[e].values).length > 0) {
				for (let o = 0; o < Object.values(recent[e].values).length; o++) {
					if (last_sub_category == Object.values(recent[e].values)[o] && last_level == recent[e].level) {temp_arr.push(recent[e])}
				}
			} else {
				temp_arr.push(recent[e])
			}
		}
		recent = temp_arr

		if (recent.length <= 0) {
			message.channel.send(`${message.author} ${user_info.names.international} doesn't seem to have made any run on that yet...`)
			return resolve(`Could not compare, user (${user_info.names.international}) has not made any run on what was requested`)
		}
		let run = recent[0]

		let game_promise = new Promise((resolve, reject) => {resolve(get(`games/${run.game}`, `embed=categories.variables`, id))})
		let level_promise = new Promise((resolve, reject) => { // Too many levels, so better to do a separate request
			run.level != undefined ? resolve(get(`levels/${run.level}`, ``, id)) : resolve(undefined)
		})

		let values = await Promise.all([game_promise, level_promise])

		let categories = values[0].categories.data
		var category

		for (let e = 0; e < categories.length; e++) {
			if (categories[e].id == run.category) {
				category = categories[e]
				e = categories.length
			}
		}

		await embed_normal(message, run, user_info, recent, values[0], category, values[1], treat_details(run.values, category.variables.data))
		return resolve(`Compared run!`)

	})

}
