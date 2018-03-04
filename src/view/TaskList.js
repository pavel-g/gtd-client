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
	
	title: 'Список задач',
	
	columns: [
		{text: 'Название', dataIndex: 'title', flex: 1}
	],
	
	initComponent: function() {
		this.store = Ext.create('Gtd.store.TaskList');
		this.tbar = [
			{
				xtype: 'button',
				icon: 'resources/icons/add.png',
				scale: 'medium',
				text: 'Добавить',
				handler: this.onNewButtonClick.bind(this)
			},
			{
				xtype: 'button',
				icon: 'resources/icons/delete.png',
				scale: 'medium',
				text: 'Удалить',
				handler: this.onRemoveButtonClick.bind(this)
			}
		];
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
	
	/**
	 * @method
	 * @protected
	 */
	onRemoveButtonClick: function() {
		var store = this.getStore();
		var items = this.getSelection();
		if (!items || items.length === 0) {
			return;
		}
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			store.remove(item);
		}
	},
	
	/**
	 * @method
	 * @protected
	 */
	onNewButtonClick: function() {
		var me = this;
		Ext.Msg.prompt('Новый список', 'Название списка задач:', function(btn, text){
			if (btn != 'ok'){
				return;
			}
			var store = me.getStore();
			var item = Ext.create('Gtd.model.TaskList', {title: text});
			store.add(item);
		});
	},
	
});