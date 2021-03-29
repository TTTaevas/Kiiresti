const user = require('../commands/user')
const recent = require('../commands/recent')
const top = require('../commands/top')
prefix = '>ki'

module.exports = (client, message) => {
	if (!message.guild) return

	if (message.content.startsWith(`${prefix} user`)) {
		return user(message)
	}
	if (message.content.startsWith(`${prefix} recent`)) {
		return recent(message)
	}
	if (message.content.startsWith(`${prefix} top`)) {
		return top(message)
	}
}
