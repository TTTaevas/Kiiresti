// THIS FUNCTION SERVES TO MAKE REQUESTS TO SPEEDRUN.COM

module.exports = async function get(type, value) {
	console.log(`(${id}) http://www.speedrun.com/api/v1/${type}${value}`)
	const axios = require("axios")
	const resp = await axios({
		method: "POST",
		url: `http://www.speedrun.com/api/v1/${type}${value}`,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"User-Agent": "Kiiresti/0.3.0",
			"X-API-Key": process.env.SPEEDRUN_TOKEN
		}
	})
	return resp.data.data
}
