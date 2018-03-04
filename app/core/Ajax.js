Ext.define('Gtd.core.Ajax', {

	singleton: true,

	request: function (options) {
		return new Ext.Promise(function (resolve, reject) {
			options = options || {};
			options.success = function (resp) {
				return resolve(resp);
			};
			options.failure = function () {
				return reject();
			};
			Ext.Ajax.request(options);
		});
	},

	json: function (options) {
		return this.request(options).then(function (resp) {
			return JSON.parse(resp.responseText);
		});
	}

});