/**
 * @class Gtd.core.AuthManager
 */
Ext.define('Gtd.core.AuthManager', {
	
	singleton: true,
	
	mixins: ['Ext.mixin.Observable'],
	
	/**
	 * @property {Number}
	 * @private
	 */
	checkInterval: 120 * 1000,
	
	/**
	 * @property {Boolean|null}
	 */
	currentStatus: null,
	
	constructor: function(config) {
		this.mixins.observable.constructor.call(this, config);
	},
	
	/**
	 * @method
	 */
	start: function() {
		this.check();
	},
	
	/**
	 * @method
	 */
	stop: function() {
		clearTimeout(this.checkInterval);
		delete this.checkInterval;
	},
	
	/**
	 * @method
	 * @return {Boolean}
	 */
	isAuth: function() {
		return Boolean(this.currentStatus);
	},
	
	/**
	 * @method
	 */
	logout: function() {
		var me = this;
		Gtd.core.Ajax.json({
			url: Gtd.core.Constants.API_URL_PREFIX + '/auth/logout',
			method: 'GET'
		}).then(function(resp) {
			if (resp && resp.success) {
				me.updateStatus(false);
			}
		});
	},
	
	/**
	 * @method
	 * @protected
	 */
	check: function() {
		var me = this;
		Gtd.core.Ajax.json({
			url: Gtd.core.Constants.API_URL_PREFIX + '/auth/login',
			method: 'GET'
		}).then(function(resp) {
			var newStatus = Boolean(resp && resp.success);
			me.updateStatus(newStatus);
			me.nextCheck();
		}).catch(function(err) {
			console.error(err);
			me.updateStatus(false);
			me.nextCheck();
		});
	},
	
	/**
	 * @method
	 * @param {Boolean} newStatus
	 */
	updateStatus: function(newStatus) {
		var oldStatus = this.currentStatus;
		this.currentStatus = newStatus;
		if (oldStatus === null) {
			this.fireEvent('firststatusload', this, newStatus);
		}
		if (newStatus !== oldStatus) {
			this.fireEvent('statuschange', this, newStatus);
			if (newStatus) {
				this.fireEvent('login', this);
			}
		}
	},
	
	/**
	 * @method
	 * @protected
	 */
	nextCheck: function() {
		this.checkTimer = setTimeout(function(me) {
			me.check();
		}, this.checkInterval, this);
	}
	
	/**
	 * @event statuschange
	 * @param {Gtd.core.AuthManager} authManager
	 * @param {Boolean} status
	 */
	
	/**
	 * @event firststatusload
	 * @param {Gtd.core.AuthManager} authManager
	 * @param {Boolean} status
	 */
	
	/**
	 * @event login
	 * @param {Gtd.core.AuthManager} authManager
	 */
	
});