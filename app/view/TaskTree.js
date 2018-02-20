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
				icon: 'resources/icons/add.png',
				scale: 'medium',
				text: 'Новая задача',
				handler: this.onAddButtonClick.bind(this)
			},
			{
				xtype: 'button',
				icon: 'resources/icons/edit.png',
				scale: 'medium',
				text: 'Редактировать',
				handler: this.onEditButtonClick.bind(this)
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
		var win = Ext.create('Gtd.view.TaskEditor', {
			listId: this.getListId()
		});
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
		var me = this;
		node.save({
			callback: function(node, operation, success) {
				if (!success) {
					return;
				}
				var store = me.store;
				store.on('load', function() {
					this.expandPath('/root/' + node.getFullPath(), {
						field: 'id',
						separator: '/',
						select: true
					})
				}, me, {single: true});
				store.load();
			}
		});
	},
	
	/**
	 * @method
	 * @protected
	 */
	onEditButtonClick: function() {
		var task = this.getSelectedTask(); // Gtd.model.TaskTree
		if (!task) {
			return;
		}
		var win = Ext.create('Gtd.view.TaskEditor', {
			listId: this.getListId()
		});
		win.setTask(task);
		win.show();
		win.on('okclick', function(data) {
			task.set('title', data.title);
			task.set('description', data.description);
			task.set('due', data.due);
			task.set('parent_id', data.parent_id);
			var me = this;
			task.save({
				callback: function(record, operation, success) {
					if (!success) {
						return;
					}
					var store = me.store;
					store.on('load', function() {
						this.expandPath('/root/' + record.getFullPath(), {
							field: 'id',
							separator: '/',
							select: true
						});
					}, me, {single: true});
					store.load();
				}
			})
		}, this, {single: true});
	},
	
	/**
	 * @method
	 * @protected
	 */
	onRemoveButtonClick: function() {
		var task = this.getSelectedTask(); // Gtd.model.TaskTree
		if (!task) {
			return;
		}
		var parentPath = task.get('path');
		var me = this;
		task.erase({
			callback: function(record, operation, success) {
				if (!success) {
					return;
				}
				var store = me.store;
				store.on('load', function() {
					if (Ext.isEmpty(parentPath)) {
						return;
					}
					me.expandPath('/root/' + parentPath, {
						field: 'id',
						separator: '/'
					});
				}, me, {single: true});
				store.load();
			}
		});
	},
	
});