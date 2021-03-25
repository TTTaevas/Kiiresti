module.exports = client => {
 	console.log(`Kiiresti is now ready to operate on account ${client.user.tag}`)
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

		setTimeout(function() {process.exit(0)}, 25000)
		setTimeout(function() {client.channels.cache.get(chan).send(">ki recent Taevas")}, 5000) // User that has made runs
		setTimeout(function() {client.channels.cache.get(chan).send(">ki recent rockon")}, 10000) // User that hasn't made runs
		setTimeout(function() {client.channels.cache.get(chan).send(">ki recent ujiojhehothkylo")}, 15000) // User that does not exist
		setTimeout(function() {client.channels.cache.get(chan).send(">ki recent")}, 20000) // Missing argument
	}
}
