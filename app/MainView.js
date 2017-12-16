/**
 * @class Gtd.MainView
 * @extends Ext.container.Viewport
 */
Ext.define('Gtd.MainView', {

	extend: 'Ext.container.Viewport',
	
	requires: [
		'Gtd.view.Task',
		'Gtd.view.Login'
	],

	layout: 'border',
	
	items: [
		{
			region: 'west',
			xtype: 'Gtd.view.Task',
			collapsible: true,
			width: 200
		},
		{
			region: 'center',
			xtype: 'panel',
			html: '<p>Center region</p>'
		}
	],
	
	listeners: {
		afterrender: function() {
			Gtd.view.Login.checkAuth();
		}
	}

});