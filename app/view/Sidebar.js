/**
 * @class Gtd.view.Sidebar
 * @extends Ext.panel.Panel
 */
Ext.define('Gtd.view.Sidebar', {
	
	extend: 'Ext.panel.Panel',
	alias: 'widget.Gtd.view.Sidebar',
	
	layout: 'card',
	
	/**
	 * @inheritdoc
	 */
	initComponent: function () {
		this.items = [
			this.getEmptyPanel(),
			this.getInfoPanel()
		];
		this.callParent();
		this.setActiveItem(this.getEmptyPanel());
		this.initListeners();
	},
	
	/**
	 * @property {Ext.panel.Panel} infoPanel
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.panel.Panel}
	 */
	getInfoPanel: function () {
		if (!this.infoPanel) {
			this.infoPanel = Ext.create('Ext.panel.Panel', {
				layout: 'form',
				items: [
					this.getTitleLabel(),
					this.getDescriptionField(),
					this.getHashTagsField(),
					this.getRepeatRulesField()
				]
			});
		}
		return this.infoPanel;
	},
	
	/**
	 * @property {Ext.panel.Panel} emptyPanel
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.panel.Panel}
	 */
	getEmptyPanel: function () {
		if (!this.emptyPanel) {
			this.emptyPanel = Ext.create('Ext.panel.Panel', {
				html: '<p>Пожалуйста, выберите задачу</p>'
			});
		}
		return this.emptyPanel;
	},
	
	/**
	 * @method
	 * @protected
	 */
	initListeners: function() {
		this.on('taskchanged', this.onTaskChanged, this);
	},
	
	/**
	 * @method
	 * @protected
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel/null} task
	 */
	onTaskChanged: function(task) {
		if (!task) {
			this.setActiveItem(this.getEmptyPanel());
			return;
		}
		this.setTask(task);
		this.setActiveItem(this.getInfoPanel());
	},
	
	/**
	 * Event fired from Gtd.view.TaskTree by select event
	 * 
	 * @event taskchanged
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel/null} data
	 */
	
	/**
	 * @property {Gtd.model.TaskTree/Ext.data.TreeModel} task
	 * @private
	 */
	
	/**
	 * @method
	 * @param {Gtd.model.TaskTree/Ext.data.TreeModel} task
	 */
	setTask: function(task) {
		this.task = task;
		
		var titleField = this.getTitleLabel();
		titleField.setText(task.get('title'));
		
		var descriptionField = this.getDescriptionField();
		descriptionField.setValue(task.get('description'));
	},
	
	/**
	 * @property {Ext.form.Label} titleLabel
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.Label}
	 */
	getTitleLabel: function() {
		if (!this.titleLabel) {
			this.titleLabel = Ext.create('Ext.form.Label');
		}
		return this.titleLabel;
	},
	
	/**
	 * @property {Ext.form.field.TextArea} descriptionField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.TextArea}
	 */
	getDescriptionField: function() {
		if (!this.descriptionField) {
			this.descriptionField = Ext.create('Ext.form.field.TextArea', {
				fieldLabel: 'Описание'
			});
		}
		return this.descriptionField;
	},
	
	/**
	 * @property {Ext.form.field.Display} hashTagsField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Display}
	 */
	getHashTagsField: function() {
		if (!this.hashTagsField) {
			this.hashTagsField = Ext.create('Ext.form.field.Display', {
				fieldLabel: 'Хештеги'
			});
		}
		return this.hashTagsField;
	},
	
	/**
	 * @property {Ext.form.field.Display} repeatRulesField
	 * @private
	 */
	
	/**
	 * @method
	 * @return {Ext.form.field.Display}
	 */
	getRepeatRulesField: function() {
		if (!this.repeatRulesField) {
			this.repeatRulesField = Ext.create('Ext.form.field.Display', {
				fieldLabel: 'Повтор'
			});
		}
		return this.repeatRulesField;
	},
	
});