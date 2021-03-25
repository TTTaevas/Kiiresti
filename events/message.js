const top = require('../commands/top')
const recent = require('../commands/recent')
prefix = '>ki'

module.exports = (client, message) => {
	if (!message.guild) return
	if (message.content.startsWith(`${prefix} top`)) {
		return top(message)
	}
	if (message.content.startsWith(`${prefix} recent`)) {
		return recent(message)
	}
}
