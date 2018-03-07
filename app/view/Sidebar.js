/**
 * @class Gtd.view.Sidebar
 * @extends Ext.panel.Panel
 */
Ext.define('Gtd.view.Sidebar', {
	
	extend: 'Ext.panel.Panel',
	alias: 'widget.Gtd.view.Sidebar',
	
	mixins: [
		'Gtd.view.mixins.GetChildCmp',
	],
	
	layout: 'card',
	
	/**
	 * @inheritdoc
	 */
	initComponent: function () {
		this.items = [
			{
				xtype: 'panel',
				html: '<p>Пожалуйста, выберите задачу</p>',
				reference: 'emptyPanel'
			},
			{
				xtype: 'panel',
				reference: 'infoPanel',
				layout: 'anchor',
				bodyPadding: 5,
				defaults: {
					labelAlign: 'left',
					width: '100%'
				},
				items: [
					{
						xtype: 'label',
						reference: 'titleLabel',
						labelAlign: 'top',
					},
					{
						xtype: 'textareafield',
						reference: 'descriptionField',
						fieldLabel: 'Описание',
						readOnly: true,
						labelAlign: 'top',
					},
					{
						xtype: 'displayfield',
						reference: 'hashTagsField',
						fieldLabel: 'Хештеги',
					},
					{
						xtype: 'displayfield',
						reference: 'repeatRulesField',
						fieldLabel: 'Повтор',
					},
				]
			}
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
		return this.getChildCmp('infoPanel');
	},
	
	/**
	 * @method
	 * @return {Ext.panel.Panel}
	 */
	getEmptyPanel: function () {
		return this.getChildCmp('emptyPanel');
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
	 * @method
	 * @return {Ext.form.Label}
	 */
	getTitleLabel: function() {
		return this.getChildCmp('titleLabel');
	},
	
	/**
	 * @method
	 * @return {Ext.form.field.TextArea}
	 */
	getDescriptionField: function() {
		return this.getChildCmp('descriptionField');
	},
	
	/**
	 * @method
	 * @return {Ext.form.field.Display}
	 */
	getHashTagsField: function() {
		return this.getChildCmp('hashTagsField');
	},
	
	/**
	 * @method
	 * @return {Ext.form.field.Display}
	 */
	getRepeatRulesField: function() {
		return this.getChildCmp('repeatRulesField');
	},
	
});