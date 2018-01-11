Ext.define('Gtd.store.TaskTree', {
	
	extend: 'Ext.data.TreeStore',
	
	requires: [
		'Gtd.model.TaskTree'
	],
	
	alias: 'store.Gtd.store.TaskTree',
	
	model: 'Gtd.model.TaskTree',
	
	autoSync: true,
	
	autoLoad: false,
	
});