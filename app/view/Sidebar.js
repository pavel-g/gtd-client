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
			{
				html: '<p>Пожалуйста, выберите задачу</p>'
			},
			this.getInfoPanel()
		];
		this.callParent();
		this.setActiveItem(1);
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
	}
	
});