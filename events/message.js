const help = require('../commands/help')
const user = require('../commands/user')
const recent = require('../commands/recent')
const compare = require('../commands/compare')
const top = require('../commands/top')
prefix = '>ki'

module.exports = async (client, message) => {
	if (message.content.startsWith(`${prefix} `)) {

		id = `${message.author.id.slice(message.author.id.length - 2)}${message.channel.id.slice(message.channel.id.length - 2)}${message.id.slice(message.id.length - 2)}`
		let currentDate = new Date()
		console.log(`\nSTART | ${id} | ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${message.content}`)

		var result

		if (message.content.startsWith(`${prefix} h`)) {result = await help(message)}
		if (message.content.startsWith(`${prefix} u`)) {result = await user(message)}
		if (message.content.startsWith(`${prefix} r`)) {result = await recent(message)}
		if (message.content.startsWith(`${prefix} c`)) {result = await compare(message)}
		if (message.content.startsWith(`${prefix} t`)) {result = await top(message)}

		currentDate = new Date()
		console.log(`FINISH | ${id} | ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${result}`)
	}
}
