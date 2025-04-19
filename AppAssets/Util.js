const multer = require('multer');
const UserFlags = require('./UserFlags');
const UserBadges = require('./UserBadges');
const Constants = require('../AppCore/Constants');

module.exports = class Util {
	static ProfilePatch(userData, guildMember, guildId) {
		const flags = new UserFlags(userData.flags);
		const badges = [];
		flags.toArray().map((element) => {
			if (UserBadges[element]) {
				badges.push(UserBadges[element]);
			}
		});
		if (userData.id !== Constants.UserIdDefault) {
			if (userData.bot) {
				badges.push(
					UserBadges.BOT_COMMANDS,
					UserBadges.BOT_AUTOMOD,
					UserBadges.APPLICATION_GUILD_SUBSCRIPTION,
				);
			} else {
				badges.push(
					UserBadges.PREMIUM_DEFAULT,
					UserBadges.GUILD_BOOSTER_LEVEL(9),
					UserBadges.PREMIUM_TENURE_V2(60),
					UserBadges.LEGACY_USERNAME,
					UserBadges.QUEST_COMPLETED,
				);
			}
		}
		/*
		// https://github.com/discord/discord-api-docs/issues/6623
		if (userData.premium_type > 0) {
			badges.push(UserBadges.PREMIUM_DEFAULT);
			if (userData.premium_type == 2) {
				badges.push(UserBadges.GUILD_BOOSTER_LEVEL(9));
			}
			// Ruby
			badges.push(UserBadges.PREMIUM_TENURE(60));
		}
		*/
		return {
			application_role_connections: [],
			badges,
			connected_accounts: [],
			guild_badges: [],
			guild_member: guildMember,
			guild_member_profile: guildMember
				? {
						guild_id: guildId,
						pronouns: '',
						bio: '',
						banner: guildMember.banner,
						accent_color: null,
						theme_colors: null,
						popout_animation_particle_type: null,
						emoji: null,
						profile_effect: null,
				  }
				: null,
			legacy_username: null,
			mutual_friends: [],
			mutual_friends_count: 0,
			mutual_guilds: [],
			premium_since: '2016-12-22T00:00:00.000000+00:00',
			premium_guild_since: '2016-12-22T00:00:00.000000+00:00',
			// Force enable Nitro features (Bot)
			premium_type: userData.bot ? 2 : userData.premium_type,
			profile_themes_experiment_bucket: 4,
			user: userData,
			user_profile: {
				accent_color: userData.accent_color,
				banner: userData.banner,
				bio: `<a:shiggy:1162436090775470160> Based on the cutest Discord client mod :3`,
				emoji: null,
				popout_animation_particle_type: null,
				profile_effect: {
					id: '1314020996856152104',
					expires_at: null,
				},
				pronouns: userData.bot ? 'bot' : 'user',
				theme_colors: null,
			},
		};
	}
	static getIDFromToken(token = '') {
		if (!token) return null;
		token = token.replace(/^(Bot|Bearer)\s*/i, '');
		return Buffer.from(token.split('.')[0], 'base64').toString();
	}
	static getDataFromRequest(req, res, callback) {
		var data = '';
		// check content-type
		if (req.headers['content-type'] !== 'application/json') {
			return multer().any()(req, res, function (err) {
				if (err) {
					console.error('Multer Error:', err);
				}
				callback(req, res);
			});
		}
		req.on('data', function (chunk) {
			data += chunk;
		});
		req.on('end', function () {
			req.rawBody = data;
			if (data) {
				try {
					req.body = JSON.parse(data);
				} catch (e) {
					req.body = undefined;
					console.error('JSON Parse Error:', e);
				}
				callback(req, res);
			}
		});
	}
	/**
	 * Create a ISO Date string
	 * Ex: 2024-12-25T14:14:53.033000+00:00
	 * @param {number} addYear
	 * @returns
	 */
	static makeISODate(addYear = 0) {
		const date = new Date();
		date.setFullYear(date.getFullYear() + addYear);
		return date.toISOString().replace('Z', '000+00:00');
	}
	/**
	 * Create a ISO Date string without milliseconds
	 * Ex: 2024-12-25T14:18:15+00:00
	 * @param {number} addYear
	 * @returns
	 */
	static makeISODateWithoutMilliseconds(addYear = 0) {
		const date = new Date();
		date.setFullYear(date.getFullYear() + addYear);
		return date.toISOString().replace(/\.\d+Z/, '+00:00');
	}
};
