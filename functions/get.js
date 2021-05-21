// THIS FUNCTION SERVES TO MAKE REQUESTS TO SPEEDRUN.COM

module.exports = async function get(type, additional, id) {
	console.log(`(${id}) GETTING: https://www.speedrun.com/api/v1/${type}?${additional}`)

	const axios = require("axios")
	const resp = await axios({
		method: "get",
		baseURL: "https://www.speedrun.com/api/v1/",
		url: `/${type}?${additional}`,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"User-Agent": "Kiiresti/0.7.2",
		}
	})
	return resp.data.data
}
