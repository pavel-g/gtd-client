/**
 * @class Gtd.view.Login
 * @extends Ext.window.Window
 */
Ext.define('Gtd.view.Login', {

	extend: 'Ext.window.Window',
	
	statics: {
		
		login: function() {
			return new Ext.Promise(function(resolve, reject) {
				var win = Ext.create('Gtd.view.Login');
				win.on('done', resolve, win, {single: true});
				win.on('failure', reject, win, {single: true});
				win.show();
			});
		},
		
		checkAuth: function() {
			return Gtd.core.Ajax.json({
				url: Gtd.core.Constants.API_URL_PREFIX + '/auth/login',
				method: 'GET'
			}).then(function(resp) {
				if (resp && resp.success) {
					return true;
				}
				return Gtd.view.Login.login();
			});
		}
		
	},
	
	title: 'Вход',

	modal: true,
	
	width: 400,
	
	height: 250,
	
	layout: 'form',
	
	getUsernameField: function() {
		if (!this.usernameField) {
			this.usernameField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Имя'
			});
		}
		return this.usernameField;
	},
	
	getPasswordField: function() {
		if (!this.passwordField) {
			this.passwordField = Ext.create('Ext.form.field.Text', {
				inputType: 'password',
				fieldLabel: 'Пароль'
			});
		}
		return this.passwordField;
	},
	
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