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
			this.infoPanel = Ext.create('Ext.panel.Panel', {});
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
	}
	
});