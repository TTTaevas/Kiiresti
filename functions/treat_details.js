// THIS FUNCTION SERVES TO TREAT DETAILS AND SUB-CATEGORIES

module.exports = function treat_vals(run_details, cat_details) {
	let details = []
	let sub_cat = false

	let Detail = class {
		constructor(id, name, choice) {
			this.id = id
			this.name = name
			this.choice = choice
		}
	}

	let Sub_category = class {
		constructor(id, name) {
			this.id = id
			this.name = name
		}
	}

	// I hate the code below oh so freaking much, please someone, make this more readable somehow

	for (let i = 0; i < Object.keys(run_details).length; i++) {
		for (let o = 0; o < Object.keys(cat_details).length; o++) {
			for (let e = 0; e < Object.keys(cat_details[o].values.values).length; e++) {
				if (Object.values(run_details)[i] == Object.keys(cat_details[o].values.values)[e]) {

					if (cat_details[o]["is-subcategory"]) {
						sub_cat = new Sub_category(Object.keys(cat_details[o].values.values)[e], Object.values(cat_details[o].values.values)[e].label)
					} else {
						details.push(new Detail(cat_details[o].id, cat_details[o].name, Object.values(cat_details[o].values.values)[e].label))
					}
				}
			}
		}
	}

	return [details, sub_cat]
}
