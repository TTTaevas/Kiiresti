module.exports = async message => {

	const get = require('../functions/get.js')
	const check_data = require('../functions/check_data.js')
	const fs = require('fs')
	const msg = message.content.split(" ")

	return await new Promise(async (resolve, reject) => {

		if (msg.length < 3) {
			message.reply("you cannot use that command without an argument!")
			return resolve(`Could not associate user, argumentless command`)
		}
		const user = msg[2]
		
		let speedrun_user = await get("users", `lookup=${user}`)
			
		var user_info
		for (let i = 0; i < speedrun_user.length; i++) {if (speedrun_user[i].names.international == user) {user_info = speedrun_user[i]}}
		if (user_info == undefined) {
			message.channel.send(`${message.author} I may be blind, but ${user} doesn't seem to exist...`)
			return resolve(`Could not associate user, specified user (${user}) doesn't exist`)
		}

		await check_data("database.json")
		let database = await JSON.parse(await fs.promises.readFile("./data/database.json"))

		let keys = Object.keys(database)
		let vals = Object.values(database)
		let exists = false
		let json = "{"

		for (let i = 0; i < keys.length; i++) {
			if (keys[i] == message.author.id) {
				json = json + `\n  "${message.author.id}": "${user}"`
				console.log(`(${id}) An entry in the database has been UPDATED: "${message.author.id}": "${user}"`)
				exists = true
			} else {
				json = json + `\n  "${keys[i]}": "${vals[i]}"`
			}
			if (i != keys.length - 1 || exists == false) {json = json + ","}
		}

		if (!exists) {
			json = json + `\n  "${message.author.id}": "${user}"`
			console.log(`(${id}) An entry in the database has been ADDED: "${message.author.id}": "${user}"`)
		}

		json = json + "\n}"

		await fs.writeFile("./data/database.json", json, function(error) {if (error) {throw error}})
		message.channel.send(`${message.author} Your Discord account has been successfully associated with "${user}" on speedrun.com!`)
		return resolve(`Associated ${message.author.tag} and ${user} successfully!`)

	})

}
