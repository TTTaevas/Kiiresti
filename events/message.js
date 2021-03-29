const user = require('../commands/user')
const recent = require('../commands/recent')
const compare = require('../commands/compare')
const top = require('../commands/top')
prefix = '>ki'

module.exports = (client, message) => {
	if (!message.guild) return

	if (message.content.startsWith(`${prefix} u`)) {
		return user(message)
	}
	if (message.content.startsWith(`${prefix} r`)) {
		return recent(message)
	}
	if (message.content.startsWith(`${prefix} c`)) {
		return compare(message)
	}
	if (message.content.startsWith(`${prefix} t`)) {
		return top(message)
	}
}
