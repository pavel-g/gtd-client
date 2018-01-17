Ext.define('Gtd.model.TaskTree', {
	
	extend: 'Ext.data.TreeModel',
	
	fields: [
		{name: 'id', allowNull: true},
		// {name: 'list_id', type: 'int', }
		{name: 'title', type: 'string'},
		{name: 'description', type: 'string', allowNull: true},
		{name: 'created', type: 'date', allowNull: true},
		{name: 'due', type: 'date', allowNull: true},
		{name: 'removed', type: 'date', allowNull: true},
		{name: 'completed', type: 'date', allowNull: true}
	],
	
	idProperty: 'id',
	
	identifier: {
		type: 'sequential'
	},
	
	proxy: {
		type: 'ajax',
		url: Gtd.core.Constants.API_URL_PREFIX + '/tree/all',
		api: {
			create: Gtd.core.Constants.API_URL_PREFIX + '/tree/create'
		},
		actionMethods: {
			create: 'POST'
		},
		reader: {
			type: 'json',
			rootProperty: 'data',
			successProperty: 'success',
			messageProperty: 'message'
		}
	}
	
});