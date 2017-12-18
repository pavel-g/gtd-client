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
				fieldLabel: 'Имя'
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
				fieldLabel: 'Пароль'
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
			var me = this;
			this.loginButton = Ext.create('Ext.button.Button', {
				text: 'Войти',
				handler: function() {
					var username = me.getUsernameField().getValue();
					var password = me.getPasswordField().getValue();
					Gtd.core.Ajax.json({
						url: Gtd.core.Constants.API_URL_PREFIX + '/auth/login',
						method: 'POST',
						jsonData: {
							username: username,
							password: password
						}
					}).then(function(resp) {
						if (resp && resp.success) {
							me.close();
							me.fireEvent('done', true);
							return;
						}
						me.fireEvent('done', false);
					}).catch(function(ex) {
						me.fireEvent('failure', ex);
					});
				}
			})
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
	},

});