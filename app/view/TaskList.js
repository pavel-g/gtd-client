/**
 * @class Gtd.view.TaskList
 * @extends Ext.grid.Panel
 */
Ext.define('Gtd.view.TaskList', {

	extend: 'Ext.grid.Panel',
	
	requires: [
		'Gtd.store.TaskList'
	],
	
	alias: 'widget.Gtd.view.TaskList',
	
	// store: 'Gtd.store.TaskList',
	
	title: 'Список задач',
	
	columns: [
		{text: 'Название', dataIndex: 'title', flex: 1}
	],
	
	initComponent: function() {
		this.store = Ext.create('Gtd.store.TaskList');
		this.callParent();
		var AuthManager = Gtd.core.AuthManager;
		AuthManager.on('login', this.onLogin, this);
		if (AuthManager.isAuth()) {
			this.onLogin();
		}
	},
	
	/**
	 * @method
	 * @protected
	 */
	onLogin: function() {
		this.getStore().load();
	},
	
});