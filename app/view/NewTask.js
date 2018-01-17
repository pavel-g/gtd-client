/**
 * @class Gtd.view.NewTask
 * @extends Ext.window.Window
 */
Ext.define('Gtd.view.NewTask', {
	
	extend: 'Ext.window.Window',
	
	title: 'Добавление задачи',
	
	modal: true,
	
	width: 400,
	
	height: 300,
	
	layout: 'anchor',
	
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
				height: 150
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
				text: 'Отмена'
			});
		}
		return this.cancelButton;
	},
	
	getOkButton: function() {
		if (!this.okButton) {
			this.okButton = Ext.create('Ext.button.Button', {
				text: 'ОК'
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
	
});