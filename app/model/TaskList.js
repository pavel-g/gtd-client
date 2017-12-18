/**
 * @class Gtd.model.TaskList
 * @extends Ext.data.Model
 */
Ext.define('Gtd.model.TaskList', {

	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id', type: 'int'},
		{name: 'title', type: 'string'}
	],
	
	proxy: {
		type: 'ajax',
		url: Gtd.core.Constants.API_URL_PREFIX + '/list/all',
		api: {
			create: Gtd.core.Constants.API_URL_PREFIX + '/list/create',
			destroy: Gtd.core.Constants.API_URL_PREFIX + '/list/remove'
		},
		actionMethods: {
			create: 'POST',
			destroy: 'POST'
		}
	}

});