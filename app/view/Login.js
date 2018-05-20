/**
 * @class Gtd.view.Login
 * @extends Ext.window.Window
 */
Ext.define('Gtd.view.Login', {

	extend: 'Ext.window.Window',
	
	title: 'Вход',

	modal: true,
	
	width: 400,
	
	height: 250,
	
	layout: 'form',
	
	/**
	 * @method
	 * @return {Ext.form.field.Text}
	 */
	getUsernameField: function() {
		if (!this.usernameField) {
			this.usernameField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Имя',
				enableKeyEvents: true
			});
		}
		return this.usernameField;
	},
	
	/**
	 * @method
	 * @return {Ext.form.field.Text}
	 */
	getPasswordField: function() {
		if (!this.passwordField) {
			this.passwordField = Ext.create('Ext.form.field.Text', {
				inputType: 'password',
				fieldLabel: 'Пароль',
				enableKeyEvents: true
			});
		}
		return this.passwordField;
	},
	
	/**
	 * @method
	 * @return {Ext.button.Button}
	 */
	getLoginButton: function() {
		if (!this.loginButton) {
			this.loginButton = Ext.create('Ext.button.Button', {
				text: 'Войти',
				handler: this.login.bind(this)
			});
		}
		return this.loginButton;
	},
	
	/**
	 * @method
	 * @protected
	 */
	initComponent: function() {
		this.buttons = [
			this.getLoginButton()
		];
		this.items = [
			this.getUsernameField(),
			this.getPasswordField()
		];
		this.callParent();
		this.initListeners();
	},
	
	/**
	 * @method
	 * @protected
	 */
	initListeners: function() {
		this.getUsernameField().on('keypress', this.onKeyPress, this);
		this.getPasswordField().on('keypress', this.onKeyPress, this);
	},
	
	/**
	 * @method
	 * @protected
	 */
	login: function() {
		var username = this.getUsernameField().getValue();
		var password = this.getPasswordField().getValue();
		var me = this;
		Gtd.core.Ajax.json({
			url: Gtd.core.Constants.API_URL_PREFIX + '/auth/login',
			method: 'POST',
			jsonData: {
				username: username,
				password: password
			}
		}).then(function(resp) {
			if (resp && resp.success) {
				me.fireEvent('done', me, true);
				me.close();
				return;
			}
			me.fireEvent('done', me, false);
		}).catch(function(ex) {
			me.fireEvent('failure', me, ex);
		});
	},
	
	/**
	 * @method
	 * @protected
	 * @param {Ext.form.field.Text} field
	 * @param {Ext.event.Event} e
	 */
	onKeyPress: function(field, e) {
		if (e.getKey() === Ext.event.Event.ENTER) {
			this.login();
		}
	},

});