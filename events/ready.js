module.exports = async client => {
 	console.log(`Kiiresti is now ready to operate on "${client.user.tag}"`)
 	client.user.setPresence({activity: {type: "WATCHING", name: "your speedruns"}})
	.catch(console.error)

	const check_data = require('../functions/check_data.js')
	await check_data("database.json", "ON_READY")
	await check_data("last_runs.json", "ON_READY")

	if (process.argv.length == 3) {
		if (process.argv[2] == "-test") {
			var chan
			
			const user_agent = process.env.npm_config_user_agent
			try {
				const version = Number(user_agent.substring(user_agent.indexOf("node/v") + 6, user_agent.indexOf("node/v") + 8))

				if (version == 12) {chan = "824718578183438377"}
				if (version == 14) {chan = "824718593325006919"}
				if (version == 15) {chan = "824718639445311488"}
				if (version >= 16) {chan = "845374022546882560"}
			} catch(e) {
				throw `Something went wrong with node version detection...\nUSER_AGENT: ${user_agent}\nERROR: ${e.message}`
			}

			let delay = 5000
			let commands = [
				"compare",
				"top",
				"recent Taevas",
				"recent ujiojhehothkylo",
				"recent",
				"user",
				"user KingSawyer",
				"user ujiojhehothkylo",
				"compare",
				"top"
			]

			for (let i = 0; i < commands.length; i++) {
				setTimeout(function() {
					let currentDate = new Date()
					console.log(`\n\n(${(delay * (i + 1)) / 1000}s, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}) SENDING: ${prefix} ${commands[i]}`)
				}, (delay * (i + 1)) - 100)
				setTimeout(function() {
					currentDate = new Date()
					client.channels.cache.get(chan).send(`${prefix} ${commands[i]}`)
					.then(console.log(`(${(delay * (i + 1)) / 1000}s, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}) SENT FOR TESTING PURPOSES: ${prefix} ${commands[i]}`))
				}, delay * (i + 1))
			}

			setTimeout(function() {process.exit(0)}, delay * (commands.length + 3))
		}
	}
}
