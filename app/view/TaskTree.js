Ext.define('Gtd.view.TaskTree', {
	
	extend: 'Ext.tree.Panel',
	
	requires: [
		'Gtd.store.TaskTree',
	],
	
	alias: 'widget.Gtd.view.TaskTree',
	
	title: 'Дерево задач',
	
	rootVisible: false,
	
	columns: [
		{text: 'Название', dataIndex: 'title', xtype: 'treecolumn', flex: 1}
	],
	
	initComponent: function() {
		this.store = Ext.create('Gtd.store.TaskTree');
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
	
});