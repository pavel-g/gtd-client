/**
 * @class Gtd.MainView
 * @extends Ext.container.Viewport
 */
Ext.define('Gtd.MainView', {

	extend: 'Ext.container.Viewport',

	layout: 'border',
	
	items: [
		{
			region: 'west',
			collapsible: true,
			title: 'Списки задач',
			width: 200
		},
		{
			region: 'center',
			xtype: 'panel',
			html: '<p>Center region</p>'
		}
	]

});