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
		this.on('checkchange', this.onCheckChange, this);
	},
	
	/**
	 * @method
	 * @param {Number/null} listId
	 */
	setListId: function(listId) {
		var store = this.getStore();
		store.setListId(listId);
		store.load();
	},
	
	/**
	 * @method
	 * @return {Number/null}
	 */
	getListId: function() {
		return this.getStore().getListId();
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
	
	onCheckChange: function(node, checked) {
		if (checked) {
			var date = new Date();
		} else {
			date = null;
		}
		node.set('completed', date);
	},
	
});