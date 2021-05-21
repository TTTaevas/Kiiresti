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
	try {
		const version = Number(user_agent.substring(user_agent.indexOf("node/v") + 6, user_agent.indexOf("node/v") + 8))
		
		if (version <= 10) {throw new Error("Discord.js cannot properly run on Node.js v<=10! Please use Node.js >=v12 instead.")}
		if (version == 12) {token = process.env.NODE12_TOKEN}
		if (version == 14) {token = process.env.NODE14_TOKEN}
		if (version == 15) {token = process.env.NODE15_TOKEN}
		if (version >= 16) {token = process.env.NODE16_TOKEN}
		if (version >= 17) {
			console.log(`
			/!\\ WARNING /!\\
			Node versions above 16 are not guaranteed to work.
			Please contact Kiiresti's developer so they can add proper support!
			( ${user_agent} | ${version} )\n`)
		}
	} catch(e) {
		throw `Something went wrong with node version detection...\nUSER_AGENT: ${user_agent}\nERROR: ${e.message}`
	}
}

client.login(token)
