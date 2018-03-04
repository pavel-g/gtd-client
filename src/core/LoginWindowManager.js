/**
 * @class Gtd.core.LoginWindowManager
 */
Ext.define('Gtd.core.LoginWindowManager', {

	singleton: true,
	
	uses: [
		'Gtd.core.AuthManager',
		'Gtd.view.Login'
	],
	
	mixins: ['Ext.mixin.Observable'],
	
	constructor: function(config) {
		this.mixins.observable.constructor.call(this, config);
	},
	
	/**
	 * @method
	 */
	init: function() {
		var AuthManager = Gtd.core.AuthManager;
		AuthManager.on('statuschange', this.onStatusChange, this);
	},
	
	/**
	 * @method
	 * @protected
	 * 
	 * Обработчик события statuschange из Gtd.core.AuthManager
	 * 
	 * @param {Gtd.core.AuthManager} manager
	 * @param {Boolean} status
	 */
	onStatusChange: function(manager, status) {
		if (status === false) {
			this.show();
		}
	},
	
	/**
	 * @method
	 * @protected
	 */
	show: function() {
		if (this.win) {
			return;
		}
		this.win = Ext.create('Gtd.view.Login');
		this.win.show();
		this.win.on('destroy', function() {
			delete this.win;
		}, this);
		this.win.on('done', function (win, status) {
			Gtd.core.AuthManager.updateStatus(status);
		})
	},

});