Ext.define('Gtd.model.TaskTree', {
	
	extend: 'Ext.data.TreeModel',
	
	fields: [
		{name: 'id', type: 'int'},
		// {name: 'list_id', type: 'int', }
		{name: 'title', type: 'string'},
		{name: 'description', type: 'string', allowNull: true},
		{name: 'created', type: 'date', allowNull: true},
		{name: 'due', type: 'date', allowNull: true},
		{name: 'removed', type: 'date', allowNull: true},
		{name: 'completed', type: 'date', allowNull: true}
	],
	
	idProperty: 'id',
	
	proxy: {
		type: 'ajax',
		url: Gtd.core.Constants.API_URL_PREFIX + '/list/full',
		api: {
			create: Gtd.core.Constants.API_URL_PREFIX + '/list/create'
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