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
	 * @cfg {Number} listId (required)
	 */
	
	/**
	 * @property {Number} listId
	 * @readonly
	 */
	
	/**
	 * @property {Gtd.model.TaskTree/null} currentTask
	 * @private
	 */
	
	/**
	 * @property {String/null} searchQuery
	 * @private
	 */
	
	/**
	 * @property {String[]/null} searchResults
	 * @private
	 */
	
	/**
	 * @method
	 * @param {Object} cfg
	 */
	constructor: function(cfg) {
		Ext.apply(this, cfg);
		if (typeof this.listId !== 'number') {
			throw new Error('Undefined listId');
		}
		return this.callParent(arguments);
	},
	
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
			this.gridStore.setListId(this.listId);
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
	 * 
	 * Union filters from createFilterExcludeCurrentTask and createFilterShowOnlySearchResults methods
	 * 
	 * @return {Ext.Promise}
	 */
	updateFilter: function() {
		var me = this;
		return new Ext.Promise(function(resolve) {
			var CLEAR_SILENT = true;
			var store = me.getGridStore();
			var filterExludeCurrentTask = me.createFilterExcludeCurrentTask();
			var filterShowOnlySearchResults = me.createFilterShowOnlySearchResults();
			if (!filterExludeCurrentTask && !filterShowOnlySearchResults) {
				store.clearFilter();
				resolve();
			} else {
				store.on('filterchange', resolve, me, {signle: true});
				store.clearFilter(CLEAR_SILENT);
				store.filterBy(function(record) {
					return Boolean(
						filterShowOnlySearchResults(record) &&
						filterExludeCurrentTask(record)
					);
				});
			}
		});
	},
	
	/**
	 * @method
	 * @protected
	 * @return {Function}
	 * @return {Gtd.model.TaskTree/Ext.data.TreeModel} return.record
	 */
	createFilterExcludeCurrentTask: function() {
		var currentTask = this.getCurrentTask();
		if (!currentTask) {
			return function() {
				return true;
			};
		}
		var currentTaskId = currentTask.get('id');
		return function(record) {
			return Boolean(record.get('id') !== currentTaskId);
		};
	},
	
	/**
	 * @method
	 * @protected
	 * @return {Function}
	 * @return {Gtd.model.TaskTree/Ext.data.TreeModel} return.record
	 */
	createFilterShowOnlySearchResults: function() {
		var searchResults = this.searchResults;
		if (!searchResults) {
			return function() {
				return true;
			};
		}
		var ids = [];
		for (var i = 0; i < searchResults.length; i++) {
			var pathIds = searchResults[i].split('/');
			if (pathIds && pathIds.length > 0) {
				for (var j = 0; j < pathIds.length; j++) {
					ids.push(Number(pathIds[j]))
				}
			}
		}
		return function(record) {
			return Boolean(ids.indexOf(record.get('id')) >= 0);
		}
	},
	
	/**
	 * @method
	 * @protected
	 * 
	 * Search and processing of results
	 * 
	 * @param {String/null} query
	 * @return {Ext.Promise}
	 */
	search: function(query) {
		if (query === this.searchQuery) {
			return Ext.Promise.resolve(this.searchResults);
		}
		if (Ext.isEmpty(query)) {
			this.searchQuery = null;
			this.searchResults = null;
			this.scanSearchResults();
			return this.updateFilter();
		}
		this.searchQuery = query;
		var me = this;
		return Gtd.core.Ajax.json({
			url: Gtd.core.Constants.API_URL_PREFIX + '/tree/find',
			params: {
				list_id: this.listId,
				title: query
			},
			method: 'GET'
		})
		.then(this.scanSearchResults.bind(this))
		.then(this.updateFilter.bind(this))
		.then(this.expandSearchResults.bind(this))
	},
	
	/**
	 * @method
	 * @protected
	 * @param {Object} data
	 */
	scanSearchResults: function(data) {
		if (!data || !data.success) {
			this.searchResults = null;
			return;
		}
		this.searchResults = Ext.Array.map(data.data, function(item) {
			return Ext.create('Gtd.model.TaskTree', item).getFullPath();
		});
	},
	
	/**
	 * @method
	 * @protected
	 * @return {Ext.Promise}
	 */
	expandSearchResults: function() {
		var results = this.searchResults;
		var grid = this.getGrid();
		var promises = [];
		for (var i = 0; i < results.length; i++) {
			var path = results[i];
			var promise = new Ext.Promise(function(resolve) {
				return grid.expandPath(path, {field: 'id', separator: '/', callback: resolve});
			});
			promises.push(promise);
		}
		return Ext.Promise.all(promises);
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