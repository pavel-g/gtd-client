Ext.define('Gtd.view.TaskTree', {
	
	extend: 'Ext.tree.Panel',
	
	requires: [
		'Gtd.store.TaskTree',
		'Gtd.view.NewTask'
	],
	
	alias: 'widget.Gtd.view.TaskTree',
	
	title: 'Дерево задач',
	
	rootVisible: false,
	
	columns: [
		{text: 'Название', dataIndex: 'title', xtype: 'treecolumn', flex: 1}
	],
	
	initComponent: function() {
		this.store = Ext.create('Gtd.store.TaskTree');
		this.tbar = [
			{
				xtype: 'button',
				iconCls: 'fa fa-plus-square',
				text: 'Добавить новую задачу',
				handler: this.onAddButtonClick.bind(this)
			}
		];
		this.callParent();
	},
	
	setListId: function(listId) {
		var store = this.getStore();
		store.listId = listId;
		var proxy = store.getProxy();
		proxy.setExtraParam('list_id', listId);
		store.load();
	},
	
	getListId: function() {
		var store = this.getStore();
		if (typeof store.listId !== 'undefined') {
			return store.listId;
		} else {
			return null;
		}
	},
	
	onAddButtonClick: function() {
		var win = Ext.create('Gtd.view.NewTask');
		win.show();
		win.on('okclick', function(data) {
			var store = this.getStore();
			var task = Ext.create('Gtd.model.TaskTree', data);
			task.set('id', null);
			task.parentNode = store.getRoot();
			store.add(task);
			task.save();
		}, this, {single: true});
	},
	
});