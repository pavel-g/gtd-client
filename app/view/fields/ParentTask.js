Ext.define('Gtd.view.fields.ParentTask', {

	extend: 'Ext.form.FieldContainer',

	layout: 'hbox',

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
				flex: 1
			});
		}
		return this.field;
	},

	getClearButton: function () {
		if (!this.clearButton) {
			this.clearButton = Ext.create('Ext.button.Button', {
				text: 'X' // TODO: 2018-02-10 заменить на значок
			});
		}
		return this.clearButton;
	},

	getSelectButton: function () {
		if (!this.selectButton) {
			this.selectButton = Ext.create('Ext.button.Button', {
				text: '=>' // TODO: 2018-02-10 заменить на значок
			});
		}
		return this.selectButton;
	}

});