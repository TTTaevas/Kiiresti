require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
var token

fs.readdir('./events/', (err, files) => {
	files.forEach(file => {
		const eventHandler = require(`./events/${file}`)
		const eventName = file.split('.')[0]
		client.on(eventName, (...args) => eventHandler(client, ...args))
	})
})

if (process.argv.length == 2) {
	token = process.env.BOT_TOKEN
} else {
	const user_agent = process.env.npm_config_user_agent
	switch(user_agent.substring(user_agent.indexOf("node/v") + 6, user_agent.indexOf("node/v") + 8)) {
		case "10":
			throw "Discord.js cannot properly run on Node.js v10! Please use Node.js >=v12 instead."
		case "12":
			token = process.env.NODE12_TOKEN
			break
		case "14":
			token = process.env.NODE14_TOKEN
			break
		case "15":
			token = process.env.NODE15_TOKEN
			break
		case "16":
			token = process.env.NODE15_TOKEN // NEED TO MAKE NEW ONE EEEEEEEEEEEE
			break
		default:
			throw `Could not find node version in order to test Kiiresti\n( ${user_agent} | ${user_agent.substring(user_agent.indexOf("node/v") + 6, user_agent.indexOf("node/v") + 8)} )`
	}
}

client.login(token)