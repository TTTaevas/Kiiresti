module.exports = message => {

	const get = require('../functions/get.js')
	const fs = require('fs')
	const msg = message.content.split(" ")

	if (msg.length < 3) {return message.reply("you cannot use that command without an argument!")}
	const user = msg[2]
	
	id = Math.floor((Math.random() * 999999) + 1) // If multiple requests are made at the same time, and one of them glitches out: better logging
	let currentDate = new Date()
	console.log(`\n---------${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${id}---------`)
	
	let speedrun_user_promise = new Promise((resolve, reject) => {resolve(get("users", `?lookup=${user}`))})
	.then((speedrun_user) => {
		
		var user_info
		for (let i = 0; i < speedrun_user.length; i++) {if (speedrun_user[i].names.international == user) {user_info = speedrun_user[i]}}
		if (user_info == undefined) {return message.channel.send(`${message.author} I may be blind, but ${user} doesn't seem to exist...`)}

		if (!fs.existsSync("./database.json")) {
			fs.writeFile("./database.json", '{\n\n}', function(error) {
				if (error) {throw error}
				console.log(`(${id}) The database file has been created!`)
			})
		}

		let database_promise = new Promise((resolve, reject) => {
			fs.readFile("./database.json", function(error, data) {
				if (error) {throw error}
				resolve(JSON.parse(data))
			})
		})
		.then((database) => {
			let keys = Object.keys(database)
			let vals = Object.values(database)
			let exists = false
			let json = "{"

			for (let i = 0; i < keys.length; i++) {
				if (keys[i] == message.author.id) {
					json = json + `\n  "${message.author.id}": "${user}"`
					console.log(`(${id}) The following in the database has been updated: "${message.author.id}": "${user}"`)
					exists = true
				} else {
					json = json + `\n  "${keys[i]}": "${vals[i]}"`
				}
				if (i != keys.length - 1 || exists == false) {json = json + ","}
			}

			if (!exists) {json = json + `\n  "${message.author.id}": "${user}"`}

			json = json + "\n}"

			fs.writeFile("./database.json", json, function(error) {
				if (error) {throw error}
				console.log(`(${id}) The database file has been updated!`)
				message.channel.send(`${message.author} Your Discord account has been successfully associated with "${user}" on speedrun.com!`)
			})

		})
		
	})

}
