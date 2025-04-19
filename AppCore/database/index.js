const path = require('path');
const electron = require('electron');
const randomID = Math.random().toString(36).slice(2);
const dbRoot = process.env.DB_PATH || path.join(electron.app.getPath('userData'), `db_${randomID}`);

const DirectMessages = require('./DirectMessages');
const PreloadedUserSettings = require('./PreloadedUserSettings');
const FrecencyUserSettings = require('./FrecencyUserSettings');

module.exports.DirectMessagesDB = new DirectMessages(path.join(dbRoot, 'DirectMessages'));
module.exports.PreloadedUserSettingsDB = new PreloadedUserSettings(path.join(dbRoot, 'PreloadedUserSettings'));
module.exports.FrecencyUserSettingsDB = new FrecencyUserSettings(path.join(dbRoot, 'FrecencyUserSettings'));