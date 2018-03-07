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
	},
	
	onSelectTaskList: function(gridpanel, record) {
		var id = record.get('id');
		var tree = this.getTaskTree(); // Gtd.view.TaskTree
		tree.setListId(id);
	},
		
});