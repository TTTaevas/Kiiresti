// THIS FUNCTION SERVES TO GET AN USER DESPITE A MISSING ARGUMENT

module.exports = async function discord_user(msg, message) {
	const fs = require('fs')
	var user
	
	if (msg.length >= 3 && message.mentions.users.first() == undefined) {return msg[2]}

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
		let lookup = message.mentions.users.first() == undefined ? message.author.id : message.mentions.users.first().id

		for (let i = 0; i < keys.length; i++) {
			if (keys[i] == lookup) {
				user = vals[i]
			}
		}

	})

	return user
}
