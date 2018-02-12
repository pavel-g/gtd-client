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
		'Gtd.core.Ajax'
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
	 * @property {String/null} searchQuery
	 * @private
	 */
	
	/**
	 * @property {Object[]/null} searchResults
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
				text: 'Найти',
				handler: this.onSearchButtonClick.bind(this)
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
		this.updateFilter();
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
	updateFilter: function() {
		var store = this.getGridStore();
		var currentTask = this.getCurrentTask();
		if (currentTask) {
			var currentTaskId = currentTask.get('id');
			store.filterBy(function(record) { // Gtd.model.TaskTree/Ext.data.TreeModel
				return Boolean(record.get('id') !== currentTaskId);
			}, this);
		} else {
			store.clearFilter();
		}
	},
	
	/**
	 * @method
	 * @protected
	 * @param {String/null} query
	 * @return {Ext.Promise}
	 * @return {Object[]/null} return.resolve - результаты поиска
	 */
	search: function(query) {
		if (query === this.searchQuery) {
			return Ext.Promise.resolve(this.searchResults);
		}
		if (Ext.isEmpty(query)) {
			this.searchQuery = null;
			this.searchResults = null;
			return Ext.Promise.resolve(null);
		}
		var listId = this.getGrid().getStore().getListId();
		var me = this;
		return Gtd.core.Ajax.json({
			url: Gtd.core.Constants.API_URL_PREFIX + '/tree/find',
			params: {
				list_id: listId,
				title: query
			}
		}).then(function(data) {
			if (!data || !data.success) {
				return;
			}
			me.searchQuery = query;
			me.searchResults = data.data;
			return me.searchResults;
		});
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
	
	/**
	 * @method
	 * @protected
	 */
	onSearchButtonClick: function() {
		var field = this.getSearchField();
		var query = field.getValue();
		this.search(query);
	},

});