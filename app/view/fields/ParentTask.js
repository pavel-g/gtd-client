/**
 * @class Gtd.view.fields.ParentTask
 * @extends Ext.form.FieldContainer
 */
Ext.define('Gtd.view.fields.ParentTask', {

	extend: 'Ext.form.FieldContainer',

	requires: [
		'Gtd.view.ParentSelector'
	],

	layout: 'hbox',
	
	/**
	 * @cfg {Number} listId (required)
	 */
	
	/**
	 * @property {Number} listId
	 * @readonly
	 */
	
	/**
	 * @property {Gtd.model.TaskTree/null} task
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
	
	initComponent: function () {
		this.items = [
			this.getField(),
			this.getClearButton(),
			this.getSelectButton()
		];
		this.callParent();
	},

	getField: function () {
		if (!this.field) {
			this.field = Ext.create('Ext.form.field.Text', {
				flex: 1,
				readonly: true
			});
		}
		return this.field;
	},

	getClearButton: function () {
		if (!this.clearButton) {
			this.clearButton = Ext.create('Ext.button.Button', {
				text: 'X', // TODO: 2018-02-10 заменить на значок
				handler: this.onClearButtonClick.bind(this)
			});
		}
		return this.clearButton;
	},

	getSelectButton: function () {
		if (!this.selectButton) {
			this.selectButton = Ext.create('Ext.button.Button', {
				text: '=>', // TODO: 2018-02-10 заменить на значок
				handler: this.onSelectButtonClick.bind(this)
			});
		}
		return this.selectButton;
	},
	
	/**
	 * @method
	 * @param {Gtd.model.TaskTree/null} task
	 */
	setTask: function(task) {
		this.task = task;
		var value = ((task) ? task.get('title') : '');
		this.getField().setValue(value);
	},
	
	/**
	 * @method
	 * @return {Gtd.model.TaskTree/null}
	 */
	getTask: function() {
		return this.task || null;
	},

	/**
	 * @method
	 * @return {Number/null}
	 */
	getTaskId: function () {
		var task = this.getTask();
		return ((task) ? task.get('id') : null);
	},
	
	/**
	 * @method
	 * @protected
	 */
	onClearButtonClick: function() {
		this.setTask(null);
	},

	/**
	 * @method
	 * @protected
	 */
	onSelectButtonClick: function () {
		var win = Ext.create('Gtd.view.ParentSelector', {
			listId: this.listId
		});
		win.on('okclick', function(win, task) {
			this.setTask(task);
		}, this, {single: true});
		win.show();
	},

});