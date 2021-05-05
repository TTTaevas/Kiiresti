const help = require('../commands/help')
const user = require('../commands/user')
const recent = require('../commands/recent')
const compare = require('../commands/compare')
const top = require('../commands/top')
prefix = '>ki'

module.exports = (client, message) => {
	if (message.content.startsWith(`${prefix} `)) {

		id = `${message.author.id.slice(message.author.id.length - 2)}${message.channel.id.slice(message.channel.id.length - 2)}${message.id.slice(message.id.length - 2)}`
		let currentDate = new Date()
		console.log(`\n${id} | ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} | ${message.content}`)

		if (message.content.startsWith(`${prefix} h`)) {return help(message)}
		if (message.content.startsWith(`${prefix} u`)) {return user(message)}
		if (message.content.startsWith(`${prefix} r`)) {return recent(message)}
		if (message.content.startsWith(`${prefix} c`)) {return compare(message)}
		if (message.content.startsWith(`${prefix} t`)) {return top(message)}

	}
}
