/**
 * @class Gtd.store.TaskList
 * @extends Ext.data.Store
 */
Ext.define('Gtd.store.TaskList', {

	extend: 'Ext.data.Store',
	
	requires: [
		'Gtd.model.TaskList'
	],

	alias: 'store.Gtd.store.TaskList',
	
	model: 'Gtd.model.TaskList',

});