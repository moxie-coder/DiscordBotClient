const BaseDatabase = require('./Base');
const Constants = require('../Constants');
const SettingProto = require('../../AppAssets/SettingProto');

module.exports = class PreloadedUserSettings extends BaseDatabase {
	constructor(customPath = null) {
		const config = Constants.PreloadedUserSettings;
		const dbPath = customPath || config.path;
		super(config.name, dbPath);
	}
	get(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let data = await this.db.get(id);
				if (!data) {
					data = this.deepConvertToBuffer(
						SettingProto.PreloadedUserSettings,
					);
					await this.db.put(id, data);
				} else {
					data = this.deepConvertToBuffer(data);
				}
                // Force override
				data.userContent.dismissedContents =
					SettingProto.PreloadedUserSettings.userContent.dismissedContents;
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	}
};
