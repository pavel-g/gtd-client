/**
 * @class Gtd.view.TaskTree
 * @extends Ext.tree.Panel
 */
Ext.define('Gtd.view.TaskTree', {
	
	extend: 'Ext.tree.Panel',
	
	requires: [
		'Gtd.store.TaskTree',
		'Gtd.view.TaskEditor',
		'Gtd.view.Sidebar',
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
		this.dockedItems = [
			this.getSidebar()
		];
		this.callParent();
		this.on('checkchange', this.onCheckChange, this);
		this.on('select', this.onSelect, this);
		this.on('selectionchange', this.onSelectionChange, this);
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
			parent_task: parentTask
		});
		win.show();
		win.on('okclick', function(data) {
			var repeatRule = data.repeat_rule;
			delete data.repeat_rule;
			var task = Ext.create('Gtd.model.TaskTree', data);
			task.setRepeatRuleFromEditor(repeatRule.check, repeatRule.type, repeatRule.interval);
			task.set('id', null);
			task.save({
				callback: function(record, operation, success) {
					if (!success) {
						return;
					}
					me.reloadAll().then(function() {
						return me.promiseExpandPath('/root/' + record.getFullPath(), {
							field: 'id',
							separator: '/'
						});
					});
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
				me.reloadAll();
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
			var repeatRule = data.repeat_rule;
			delete data.repeat_rule;
			task.set(data);
			task.setRepeatRuleFromEditor(repeatRule.check, repeatRule.type, repeatRule.interval);
			var me = this;
			task.save({
				callback: function(record, operation, success) {
					if (!success) {
						return;
					}
					me.reloadAll();
				}
			});
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
		var me = this;
		task.erase({
			callback: function(record, operation, success) {
				if (!success) {
					return;
				}
				me.reloadAll();
			}
		});
	},
	
	/**
	 * @method
	 * @protected
	 * @return {Gtd.model.TaskTree[]/Ext.data.TreeModel[]}
	 */
	getExpandedNodes: function() {
		var res = [];
		var store = this.getStore();
		store.each(function(node) {
			if (node.isExpanded()) {
				res.push(node);
			}
		});
		return res;
	},
	
	/**
	 * @method
	 * @protected
	 * @return {String[]}
	 */
	getExpandedPaths: function() {
		var res = [];
		var nodes = this.getExpandedNodes();
		for (var i = 0; i < nodes.length; i++) {
			res.push(nodes[i].getFullPath());
		}
		return res;
	},
	
	/**
	 * @method
	 * @return {Ext.Promise}
	 */
	reloadAll: function() {
		var me = this;
		var paths = me.getExpandedPaths();
		return this.getStore().promiseLoad().then(function(res) {
			if (!res.success) {
				return;
			}
			var promises = [];
			for (var i = 0; i < paths.length; i++) {
				var path = paths[i];
				var promise = me.promiseExpandPath('/root/' + path, {
					field: 'id',
					separator: '/'
				});
				promises.push(promise);
			}
			return Ext.Promise.all(promises);
		});
	},

	/**
	 * @method
	 * @return {Ext.Promise}
	 * @return {Object} return.resolve
	 * @return {Boolean} return.resolve.success
	 * @return {Gtd.model.TaskTree/Ext.data.TreeModel} return.resolve.record
	 * @return {Object} return.resolve.node
	 */
	promiseExpandPath: function(path, params) {
		params = params || {};
		var me = this;
		return new Ext.Promise(function (resolve) {
			params.callback = function (success, record, node) {
				return resolve({
					success: success,
					record: record,
					node: node
				});
			};
			return me.expandPath(path, params);
		});
	},
	
	/**
	 * @property {Gtd.view.Sidebar} sidebar
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Gtd.view.Sidebar}
	 */
	getSidebar: function() {
		if (!this.sidebar) {
			this.sidebar = Ext.create('Gtd.view.Sidebar', {
				dock: 'right',
				width: 350
			});
		}
		return this.sidebar;
	},
	
	/**
	 * @method
	 * @protected
	 * @param {Gtd.view.TaskTree/Ext.tree.Panel} treepanel
	 * @param {Gtd.model.TaskTree[]/Ext.data.TreeModel[]} selected
	 */
	onSelectionChange: function(treepanel, selected) {
		if (Ext.isEmpty(selected)) {
			var sidebar = this.getSidebar();
			sidebar.fireEvent('taskchanged', null);
		}
	},
	
	/**
	 * @method
	 * @protected
	 * @param {Gtd.view.TaskTree} treepanel
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel} record
	 */
	onSelect: function(treepanel, record) {
		var sidebar = this.getSidebar();
		sidebar.fireEvent('taskchanged', record);
	},
	
});