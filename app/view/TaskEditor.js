Ext.require(['Gtd.core.RepeatTypes'], function() {

/**
 * @class Gtd.view.TaskEditor
 * @extends Ext.window.Window
 */
Ext.define('Gtd.view.TaskEditor', {
	
	extend: 'Ext.window.Window',

	requires: [
		'Gtd.view.fields.ParentTask',
		'Gtd.store.RepeatTypes'
	],
	
	title: 'Добавление задачи',
	
	modal: true,
	
	width: 400,
	
	height: 400,
	
	layout: 'fit',
	
	// defaults: {
	// 	labelAlign: 'top',
	// 	width: '100%'
	// },
	
	// bodyPadding: 5,
	
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
		var startField = this.getStartField();
		var dueField = this.getDueField();
		var priorityField = this.getPriorityField();
		return {
			title: titleField.getValue(),
			description: descriptionField.getValue(),
			parent_id: parentId,
			start: startField.getValue(),
			due: dueField.getValue(),
			priority: priorityField.getValue(),
			hashtags: this.getHashtagsValue()
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
		this.updateRepeatFieldsAvailableStates();
	},
	
	/**
	 * @method
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel} task
	 */
	setTask: function(task) {
		var titleField = this.getTitleField();
		var descriptionField = this.getDescriptionField();
		var parentTaskField = this.getParentTaskField();
		var startField = this.getStartField();
		var dueField = this.getDueField();
		var priorityField = this.getPriorityField();
		titleField.setValue(task.get('title'));
		descriptionField.setValue(task.get('description'));
		startField.setValue(task.get('start'));
		dueField.setValue(task.get('due'));
		this.setHashtagsFromTask(task);
		priorityField.setValue(task.get('priority'));
		var parentTask = task.parentNode;
		if (!parentTask || parentTask.isRoot()) {
			parentTask = null;
		} else {
			this.setParentTask(parentTask);
		}
		parentTaskField.setExcludedTask(task);
		this.updateRepeatFieldsAvailableStates();
	},
	
	/**
	 * @method
	 * @protected
	 */
	setHashtagsFromTask: function(task) {
		var hashtagsField = this.getHashtagsField();
		hashtagsField.setValue(task.getHashtagsAsString());
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
		var defaults = {
			labelAlign: 'top',
			width: '100%'
		};
		var bodyPadding = 5;
		this.items = [
			{
				xtype: 'tabpanel',
				items: [
					{
						title: 'Основные',
						layout: 'vbox',
						defaults: defaults,
						bodyPadding: bodyPadding,
						items: [
							this.getTitleField(),
							this.getDescriptionField(),
							this.getParentTaskField()
						]
					},
					{
						title: 'Атрибуты',
						layout: 'vbox',
						defaults: defaults,
						bodyPadding: bodyPadding,
						items: [
							this.getStartField(),
							this.getDueField(),
							this.getHashtagsField(),
							this.getPriorityField()
						]
					},
					{
						title: 'Повтор',
						layout: 'vbox',
						defaults: defaults,
						bodyPadding: bodyPadding,
						items: [
							this.getRepeatCheckbox(),
							this.getRepeatTypeCombobox(),
							this.getPlusTimeField()
						]
					}
				]
			}
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
	
	/**
	 * @property {Ext.form.field.Date} dueField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Date}
	 */
	getDueField: function() {
		if (!this.dueField) {
			this.dueField = Ext.create('Ext.form.field.Date', {
				fieldLabel: 'Дата завершения'
			});
		}
		return this.dueField;
	},
	
	/**
	 * @property {Ext.form.field.Date} startField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Date}
	 */
	getStartField: function() {
		if (!this.startField) {
			this.startField = Ext.create('Ext.form.field.Date', {
				fieldLabel: 'Дата начала'
			});
		}
		return this.startField;
	},
	
	/**
	 * @property {Ext.form.field.Text} hashtagsField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Text}
	 */
	getHashtagsField: function() {
		if (!this.hashtagsField) {
			this.hashtagsField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Хештеги'
			});
		}
		return this.hashtagsField;
	},
	
	/**
	 * @method
	 * @return {String[]|null}
	 */
	getHashtagsValue: function() {
		var field = this.getHashtagsField();
		var value = field.getValue();
		if (!value || value === '') {
			return null;
		}
		var hashtags = value.split(',');
		var res = [];
		for (var i in hashtags) {if (hashtags.hasOwnProperty(i)) {
			var hashtag = hashtags[i].trim();
			if (hashtag && hashtag !== '') {
				res.push(hashtag);
			}
		}}
		if (res.length === 0) {
			return null;
		}
		return res;
	},
	
	/**
	 * @property {Ext.form.field.Checkbox} repeatCheckbox
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Checkbox}
	 */
	getRepeatCheckbox: function() {
		if (!this.repeatCheckbox) {
			this.repeatCheckbox = Ext.create('Ext.form.field.Checkbox', {
				boxLabel: 'Повторяющаяся задача'
			});
			this.repeatCheckbox.on('change', this.updateRepeatFieldsAvailableStates, this);
		}
		return this.repeatCheckbox;
	},
	
	/**
	 * @property {Ext.form.field.ComboBox} repeatTypeCombobox
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.ComboBox}
	 */
	getRepeatTypeCombobox: function() {
		if (!this.repeatTypeCombobox) {
			this.repeatTypeCombobox = Ext.create('Ext.form.field.ComboBox', {
				fieldLabel: 'Тип повторения',
				store: Ext.create('Gtd.store.RepeatTypes'),
				displayField: 'name',
				valueField: 'type',
				editable: false,
			});
			this.repeatTypeCombobox.on('change', this.updateRepeatFieldsAvailableStates, this);
		}
		return this.repeatTypeCombobox;
	},
	
	/**
	 * @property {Ext.form.field.Number} plusTimeField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Number}
	 */
	getPlusTimeField: function() {
		if (!this.plusTimeField) {
			this.plusTimeField = Ext.create('Ext.form.field.Number', {
				fieldLabel: 'Число дней для автоповтора'
			});
		}
		return this.plusTimeField;
	},
	
	/**
	 * @method
	 * @protected
	 */
	updateRepeatFieldsAvailableStates: function() {
		var checkbox = this.getRepeatCheckbox();
		var repeatType = this.getRepeatTypeCombobox();
		var plusTime = this.getPlusTimeField();
		if (!checkbox.getValue()) {
			repeatType.setDisabled(true);
			plusTime.setDisabled(true);
			return;
		}
		repeatType.setDisabled(false);
		var RepeatTypes = Gtd.core.RepeatTypes;
		if (repeatType.getValue() === RepeatTypes.AUTO_REPEAT) {
			plusTime.setDisabled(false);
		} else {
			plusTime.setDisabled(true);
		}
	},
	
	/**
	 * @property {Ext.form.field.Number} priorityField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Number}
	 */
	getPriorityField: function() {
		if (!this.priorityField) {
			this.priorityField = Ext.create('Ext.form.field.Number', {
				fieldLabel: 'Приоритет'
			});
		}
		return this.priorityField;
	},
	
});

});