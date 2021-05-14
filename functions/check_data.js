// THIS FUNCTION SERVES TO CHECK FOR DATA, AND CREATE IT IF IT DOES NOT EXIST

module.exports = async function check_data(file_name, id) {
	const fs = require('fs')

	return await new Promise(async (resolve, reject) => {
		if (!fs.existsSync("./data/")) {
			await fs.promises.mkdir("./data/", {recursive: true})
			.catch((error) => {throw error})
			return resolve(console.log(`(${id}) The data folder has been created!`))
		}

		if (!fs.existsSync(`./data/${file_name}`)) {
			await fs.writeFile(`./data/${file_name}`, '[]', async function(error) {
				if (error) {throw error}
				await timer(500) // A bug regarding newly created files not being able to be read makes me write this
				return resolve(console.log(`(${id}) The ${file_name} file has been created in the data folder!`))
			})
		}
	})
}

async function timer(t) {
	return await new Promise(async (resolve, reject) => {
		setTimeout(function() {return resolve("reee")}, t)
	})
}
