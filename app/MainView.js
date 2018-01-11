/**
 * @class Gtd.MainView
 * @extends Ext.container.Viewport
 */
Ext.define('Gtd.MainView', {

	extend: 'Ext.container.Viewport',
	
	requires: [
		'Gtd.view.TaskList',
		'Gtd.view.Login',
		'Gtd.view.TaskTree'
	],

	layout: 'border',
	
	items: [
		{
			region: 'west',
			xtype: 'Gtd.view.TaskList',
			collapsible: true,
			width: 200
		},
		{
			region: 'center',
			xtype: 'Gtd.view.TaskTree'
		}
	],
	
});