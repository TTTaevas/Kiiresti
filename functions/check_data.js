// THIS FUNCTION SERVES TO CHECK FOR DATA, AND CREATE IT IF IT DOES NOT EXIST

module.exports = async function check_data(file_name, id) {
	const fs = require('fs')

	if (!fs.existsSync("./data/")) {
		await fs.promises.mkdir("./data/", {recursive: true})
		.catch((error) => {throw error})
		console.log(`(${id}) The data folder has been created!`)
	}

	if (!fs.existsSync(`./data/${file_name}`)) {
		await fs.writeFile(`./data/${file_name}`, '[]', function(error) {
			if (error) {throw error}
			console.log(`(${id}) The ${file_name} file has been created in the data folder!`)
		})
	}

	return 1
}
