/**
 * @class Gtd.view.NewTask
 * @extends Ext.window.Window
 */
Ext.define('Gtd.view.NewTask', {
	
	extend: 'Ext.window.Window',
	
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
	
	getData: function() {
		var titleField = this.getTitleField();
		var descriptionField = this.getDescriptionField();
		var dueDateField = this.getDueDateField();
		return {
			title: titleField.getValue(),
			description: descriptionField.getValue(),
			due: dueDateField.getValue()
		};
	},
	
	getTitleField: function() {
		if (!this.titleField) {
			this.titleField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Название'
			});
		}
		return this.titleField;
	},
	
	getDescriptionField: function() {
		if (!this.descriptionField) {
			this.descriptionField = Ext.create('Ext.form.field.TextArea', {
				fieldLabel: 'Описание',
				flex: 1
			});
		}
		return this.descriptionField;
	},
	
	getDueDateField: function() {
		if (!this.dueDateField) {
			this.dueDateField = Ext.create('Ext.form.field.Date', {
				fieldLabel: 'Срок завершения',
				format: 'd.m.Y'
			});
		}
		return this.dueDateField;
	},
	
	getCancelButton: function() {
		if (!this.cancelButton) {
			this.cancelButton = Ext.create('Ext.button.Button', {
				text: 'Отмена',
				handler: this.onCancelButtonClick.bind(this)
			});
		}
		return this.cancelButton;
	},
	
	getOkButton: function() {
		if (!this.okButton) {
			this.okButton = Ext.create('Ext.button.Button', {
				text: 'ОК',
				handler: this.onOkButtonClick.bind(this)
			});
		}
		return this.okButton;
	},
	
	initComponent: function() {
		this.items = [
			this.getTitleField(),
			this.getDescriptionField(),
			this.getDueDateField()
		];
		this.buttons = [
			this.getCancelButton(),
			this.getOkButton()
		];
		this.callParent();
	},
	
	onOkButtonClick: function() {
		this.fireEvent('okclick', this.getData());
	},
	
	onCancelButtonClick: function() {
		this.fireEvent('cancelclick');
	},
	
	/**
	 * @event okclick
	 * @param {Object} data
	 * @param {String} data.title
	 * @param {String} data.description
	 * @param {Date/String} data.due
	 */
	
	/**
	 * @event cancelclick
	 */
	
});