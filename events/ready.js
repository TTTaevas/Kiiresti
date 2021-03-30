module.exports = client => {
 	console.log(`Kiiresti is now ready to operate on "${client.user.tag}"`)
 	client.user.setPresence({ activity: { type: 'WATCHING', name: 'your speedruns' }})
	.catch(console.error)

	if (process.argv.length == 3) {
		var chan
		
		const user_agent = process.env.npm_config_user_agent
		switch(user_agent.substring(user_agent.indexOf("node/v") + 6, user_agent.indexOf("node/v") + 8)) {
			case "12":
				chan = "824718578183438377"
				break
			case "14":
				chan = "824718593325006919"
				break
			case "15":
				chan = "824718639445311488"
				break
			default:
				console.log("Could not find node version for testing messages")
				process.exit(1)
		}

		let delay = 3000
		let commands = [
			"compare",
			"recent Taevas",
			"recent ujiojhehothkylo",
			"recent",
			"user",
			"user Taevas",
			"user ujiojhehothkylo",
			"compare"
		]

		for (let i = 0; i < commands.length; i++) {
			setTimeout(function() {console.log(`\n\n(${(delay * (i + 1)) / 1000}s) TESTING: ${prefix} ${commands[i]}`)}, (delay - 100) * (i + 1))
			setTimeout(function() {client.channels.cache.get(chan).send(`${prefix} ${commands[i]}`)}, delay * (i + 1))
		}

		setTimeout(function() {process.exit(0)}, delay * (commands.length + 1))
	}
}
