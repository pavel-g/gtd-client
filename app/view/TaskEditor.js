/**
 * @class Gtd.view.TaskEditor
 * @extends Ext.window.Window
 */
Ext.define('Gtd.view.TaskEditor', {
	
	extend: 'Ext.window.Window',

	requires: [
		'Gtd.view.fields.ParentTask'
	],
	
	title: 'Добавление задачи',
	
	modal: true,
	
	width: 400,
	
	height: 400,
	
	layout: 'vbox',
	
	defaults: {
		labelAlign: 'top',
		width: '100%'
	},
	
	bodyPadding: 5,
	
	closable: false,
	
	/**
	 * @cfg {Number} listId (required)
	 */
	
	/**
	 * @property {Number} listId
	 * @readonly
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
	 * @return {Object} return
	 * @return {String} return.title
	 * @return {String} return.description
	 * @return {Date/String} return.due
	 * @return {Number/null} return.parent_id
	 */
	getData: function() {
		var titleField = this.getTitleField();
		var descriptionField = this.getDescriptionField();
		var parentTaskField = this.getParentTaskField();
		var parentId = parentTaskField.getTaskId();
		return {
			title: titleField.getValue(),
			description: descriptionField.getValue(),
			parent_id: parentId,
		};
	},

	/**
	 * @method
	 * @param {Object} data
	 * @param {String/null} data.title
	 * @param {String/null} data.description
	 * @param {String/Date/null} data.due
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel/null} data.parent_task
	 */
	setData: function (data) {
		data = data || {};
		var titleField = this.getTitleField();
		var descriptionField = this.getDescriptionField();
		var parentTaskField = this.getParentTaskField();
		titleField.setValue(data.title);
		descriptionField.setValue(data.description);
		this.setParentTask(data.parent_task);
	},
	
	/**
	 * @method
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel} task
	 */
	setTask: function(task) {
		var titleField = this.getTitleField();
		var descriptionField = this.getDescriptionField();
		var parentTaskField = this.getParentTaskField();
		titleField.setValue(task.get('title'));
		descriptionField.setValue(task.get('description'));
		var parentTask = task.parentNode;
		if (!parentTask || parentTask.isRoot()) {
			parentTask = null;
		} else {
			this.setParentTask(parentTask);
		}
		parentTaskField.setExcludedTask(task);
	},

	/**
	 * @method
	 * @return {Ext.form.field.Text}
	 */
	getTitleField: function() {
		if (!this.titleField) {
			this.titleField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Название'
			});
		}
		return this.titleField;
	},

	/**
	 * @method
	 * @return {Ext.form.field.TextArea}
	 */
	getDescriptionField: function() {
		if (!this.descriptionField) {
			this.descriptionField = Ext.create('Ext.form.field.TextArea', {
				fieldLabel: 'Описание',
				flex: 1
			});
		}
		return this.descriptionField;
	},

	/**
	 * @method
	 * @return {Ext.button.Button}
	 */
	getCancelButton: function() {
		if (!this.cancelButton) {
			this.cancelButton = Ext.create('Ext.button.Button', {
				text: 'Отмена',
				handler: this.onCancelButtonClick.bind(this)
			});
		}
		return this.cancelButton;
	},

	/**
	 * @method
	 * @return {Ext.button.Button}
	 */
	getOkButton: function() {
		if (!this.okButton) {
			this.okButton = Ext.create('Ext.button.Button', {
				text: 'ОК',
				handler: this.onOkButtonClick.bind(this)
			});
		}
		return this.okButton;
	},

	/**
	 * @method
	 * @return {Gtd.view.fields.ParentTask}
	 */
	getParentTaskField: function () {
		if (!this.parentTaskField) {
			this.parentTaskField = Ext.create('Gtd.view.fields.ParentTask', {
				fieldLabel: 'Родительская задача',
				listId: this.listId
			});
		}
		return this.parentTaskField;
	},

	/**
	 * @method
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel/null} task
	 */
	setParentTask: function (task) {
		var parentTaskField = this.getParentTaskField();
		parentTaskField.setTask(task);
	},

	/**
	 * @method
	 * @return {Gtd.model.TaskTree/Ext.data.TreeModel/null}
	 */
	getParentTask: function () {
		var parentTaskField = this.getParentTaskField();
		return parentTaskField.getTask();
	},

	/**
	 * @method
	 * @protected
	 */
	initComponent: function() {
		this.items = [
			this.getTitleField(),
			this.getDescriptionField(),
			this.getParentTaskField()
		];
		this.buttons = [
			this.getCancelButton(),
			this.getOkButton()
		];
		this.callParent();
	},

	/**
	 * @method
	 * @protected
	 */
	onOkButtonClick: function() {
		this.fireEvent('okclick', this.getData());
		this.close();
	},

	/**
	 * @method
	 * @protected
	 */
	onCancelButtonClick: function() {
		this.fireEvent('cancelclick');
		this.close();
	},
	
	/**
	 * @event okclick
	 * @param {Object} data
	 * @param {String} data.title
	 * @param {String} data.description
	 * @param {Date/String} data.due
	 * @param {Number/null} data.parent_id
	 */
	
	/**
	 * @event cancelclick
	 */
	
});