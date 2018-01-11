Ext.define('Gtd.store.TaskTree', {
	
	extend: 'Ext.data.TreeStore',
	
	requires: [
		'Gtd.model.TaskTree'
	],
	
	alias: 'store.Gtd.store.TaskTree',
	
	model: 'Gtd.store.TaskTree',
	
	autoSync: true,
	
	autoLoad: false,
	
	rootVisible: false,
	
});