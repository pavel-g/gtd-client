// @flow

/**
 * @class Gtd.MainView
 * @extends Ext.container.Viewport
 */
Ext.define('Gtd.MainView', {

	extend: 'Ext.container.Viewport',
	
	requires: [
		'Gtd.view.TaskList',
		'Gtd.view.Login',
		'Gtd.view.TaskTree'
	],

	layout: 'border',
	
	initComponent: function() {
		this.items = [
			this.getTaskList(),
			this.getTaskTree(),
			this.getSidebar()
		];
		this.callParent();
		this.initListeners();
	},
	
	getTaskList: function() {
		if (this.taskList) {
			return this.taskList;
		}
		this.taskList = Ext.create('Gtd.view.TaskList', {
			width: 200,
			region: 'west',
			collapsible: true
		});
		return this.taskList;
	},
	
	/**
	 * @method
	 * @return {Gtd.view.TaskTree}
	 */
	getTaskTree: function() {
		if (this.taskTree) {
			return this.taskTree;
		}
		this.taskTree = Ext.create('Gtd.view.TaskTree', {
			region: 'center'
		});
		return this.taskTree;
	},
	
	initListeners: function() {
		var list = this.getTaskList(); // Gtd.view.TaskList
		list.on('select', this.onSelectTaskList, this);
		/** @type {Gtd.view.TaskTree} */  
		var tree = this.getTaskTree();
		tree.on('select', this.onSelectTaskTree, this);
		tree.on('selectionchange', this.onSelectionChange, this);
	},
	
	onSelectTaskList: function(gridpanel, record) {
		var id = record.get('id');
		var tree = this.getTaskTree(); // Gtd.view.TaskTree
		tree.setListId(id);
	},
	
	/**
	 * @method
	 * @protected
	 * @param {Gtd.view.TaskTree} treepanel
	 */
	onSelectTaskTree: function(treepanel, record) {
		var sidebar = this.getSidebar();
		sidebar.fireEvent('taskchanged', record);
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
				region: 'east',
				width: 250
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
	onSelectionChange: function(treepanel: Gtd_view_TaskTree, selected: Gtd_model_TaskTree): void {
		if (Ext.isEmpty(selected)) {
			var sidebar = this.getSidebar();
			sidebar.fireEvent('taskchanged', null);
		}
	}
	
});