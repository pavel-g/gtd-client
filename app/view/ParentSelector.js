/**
 * @class Gtd.view.ParentSelector
 * @extends Ext.window.Window
 *
 * Окно для выбора родительской задачи
 */
Ext.define('Gtd.view.ParentSelector', {

	extend: 'Ext.window.Window',
	
	requires: [
		'Gtd.store.TaskTree',
		'Gtd.model.TaskTree',
	],

	title: 'Выбор родительской задачи',

	modal: true,

	width: 400,

	height: 400,
	
	layout: 'fit',
	
	/**
	 * @property {Gtd.model.TaskTree/null} currentTask
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Text}
	 */
	getSearchField: function() {
		if (!this.searchField) {
			this.searchField = Ext.create('Ext.form.field.Text', {
				flex: 1
			});
		}
		return this.searchField;
	},
	
	/**
	 * @method
	 * @return {Ext.button.Button}
	 */
	getSearchButton: function() {
		if (!this.searchButton) {
			this.searchButton = Ext.create('Ext.button.Button', {
				text: 'Найти'
			});
		}
		return this.searchButton;
	},
	
	/**
	 * @method
	 * @return {Gtd.store.TaskTree}
	 */
	getGridStore: function() {
		if (!this.gridStore) {
			this.gridStore = Ext.create('Gtd.store.TaskTree');
		}
		return this.gridStore;
	},
	
	/**
	 * @method
	 * @return {Ext.grid.Panel}
	 */
	getGrid: function() {
		if (!this.grid) {
			this.grid = Ext.create('Ext.tree.Panel', {
				store: this.getGridStore(),
				columns: [
					{text: 'Название', dataIndex: 'title', xtype: 'treecolumn', flex: 1}
				],
				rootVisible: false,
			});
		}
		return this.grid;
	},
	
	/**
	 * @method
	 * @return {Ext.button.Button}
	 */
	getOkButton: function() {
		if (!this.okButton) {
			this.okButton = Ext.create('Ext.button.Button', {
				text: 'Ок'
			});
		}
		return this.okButton;
	},
	
	/**
	 * @method
	 * @return {Ext.button.Button}
	 */
	getCancelButton: function() {
		if (!this.cancelButton) {
			this.cancelButton = Ext.create('Ext.button.Button', {
				text: 'Отмена'
			});
		}
		return this.cancelButton;
	},
	
	/**
	 * @method
	 * @param {Gtd.model.TaskTree/null} task
	 */
	setCurrentTask: function(task) {
		this.currentTask = task;
	},
	
	/**
	 * @method
	 * @return {Gtd.model.TaskTree/null}
	 */
	getCurrentTask: function() {
		return this.currentTask || null;
	},
	
	/**
	 * @method
	 * @protected
	 */
	initComponent: function() {
		this.tbar = [
			this.getSearchField(),
			this.getSearchButton()
		];
		this.items = [
			this.getGrid()
		];
		this.buttons = [
			this.getOkButton(),
			this.getCancelButton()
		];
		this.callParent();
	},

});