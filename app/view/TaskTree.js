/**
 * @class Gtd.view.TaskTree
 * @extends Ext.tree.Panel
 */
Ext.define('Gtd.view.TaskTree', {
	
	extend: 'Ext.tree.Panel',
	
	requires: [
		'Gtd.store.TaskTree',
		'Gtd.view.TaskEditor'
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
	
	/**
	 * @method
	 * @return {Gtd.model.TaskTree/Ext.data.TreeModel/null}
	 */
	getSelectedTask: function() {
		var sel = this.getSelection();
		if (sel && sel.length > 0) {
			return sel[0];
		}
		return null;
	},

	/**
	 * @method
	 * @protected
	 */
	onAddButtonClick: function() {
		var me = this;
		var win = Ext.create('Gtd.view.TaskEditor');
		var parentTask = this.getSelectedTask();
		win.setData({
			title: '',
			description: '',
			due: null,
			parent_task: parentTask
		});
		win.show();
		win.on('okclick', function(data) {
			var store = this.getStore();
			var task = Ext.create('Gtd.model.TaskTree', data);
			task.set('id', null);
			task.set('parent_id', data.parent_id);
			var taskPath = task.getPath('id', '/');
			task.save({
				callback: function(record, operation, success) {
					if (!success) {
						return;
					}
					store.on('load', function() {
						this.expandPath('/root/' + record.getFullPath(), {
							field: 'id',
							separator: '/',
							select: true
						});
					}, me, {single: true});
					store.load();
				}
			});
		}, this, {single: true});
	},

	/**
	 * @method
	 * @protected
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel} node
	 * @param {Boolean} checked
	 */
	onCheckChange: function(node, checked) {
		if (checked) {
			var date = new Date();
		} else {
			date = null;
		}
		node.set('completed', date);
	},
	
});