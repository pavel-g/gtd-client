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
	
	listeners: {
		afterrender: function(me) {
			me.initListeners();
		}
	},
	
	initComponent: function() {
		this.store = Ext.create('Gtd.store.TaskList');
		this.callParent();
	},
	
	/**
	 * @method
	 * @protected
	 */
	initListeners: function() {
		Gtd.core.AuthManager.on('login', this.onLogin, this);
	},
	
	/**
	 * @method
	 * @protected
	 */
	onLogin: function() {
		debugger;
		this.getStore().load();
	},
	
});