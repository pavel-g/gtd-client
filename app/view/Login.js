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
	
	items: [
		{
			xtype: 'textfield',
			name: 'username',
			reference: 'usernameField',
			fieldLabel: 'Имя'
		},
		{
			xtype: 'textfield',
			name: 'password',
			reference: 'passwordField',
			inputType: 'password',
			fieldLabel: 'Пароль'
		}
	],
	
	getLoginButton: function() {
		if (!this.loginButton) {
			var me = this;
			this.loginButton = Ext.create('Ext.button.Button', {
				text: 'Войти',
				handler: function() {
					var username = me.lookupReference('usernameField').getValue();
					var password = me.lookupReference('passwordField').getValue();
					Ext.Ajax.request({
						url: Gtd.core.Constants.API_URL_PREFIX + '/login',
						method: 'POST',
					});
				}
			})
		}
		return this.loginButton;
	},
	
	initComponent: function() {
		this.button = [
			this.getLoginButton()
		];
		this.callParent();
	},

});