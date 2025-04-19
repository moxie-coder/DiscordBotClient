const BaseDatabase = require("./Base");
const Constants = require("../Constants");

module.exports = class DirectMessages extends BaseDatabase {
	constructor(customPath = null) {
		const config = Constants.DirectMessages;
		const dbPath = customPath || config.path;
		super(config.name, dbPath);
	}
	// Save: bot id - {[key: channel_id]: private_channel_object}
	get(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let data = await this.db.get(id);
				if (!data) {
					data = {}
					await this.db.put(id, data);
				}
				let isFixed = false;
				for (const key in data) {
					// Fix error
					if (Array.isArray(data[key]?.recipients[0]?.id)) {
						this.log.warn(`Fixing the error for the recipients key in the Private Channel ${key} data of bot ${id}`);
						data[key].recipients[0].id = data[key].recipients[0].id[0];
						isFixed = true;
					}
				}
				if (isFixed) {
					// Save fixed data
					this.log.warn(`An error was detected in the DMs channel, and the error correction data has been saved for bot ${id}`);
					await this.db.put(id, data);
				}
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	}
};