/**
 * @class Gtd.model.TaskTree
 * @extends Ext.data.TreeModel
 */
Ext.define('Gtd.model.TaskTree', {
	
	extend: 'Ext.data.TreeModel',
	
	fields: [
		{name: 'id', allowNull: true},
		// {name: 'list_id', type: 'int', }
		{name: 'title', type: 'string'},
		{name: 'description', type: 'string', allowNull: true},
		{name: 'created', type: 'date', allowNull: true},
		{name: 'removed', type: 'date', allowNull: true},
		{name: 'completed', type: 'date', allowNull: true},
		{name: 'path', type: 'string', allowNull: true},
		{
			name: 'checked',
			type: 'boolean',
			calculate: function(data) {
				return Boolean(data.completed);
			}
		}
	],
	
	idProperty: 'id',
	
	identifier: {
		type: 'sequential'
	},
	
	proxy: {
		type: 'ajax',
		url: Gtd.core.Constants.API_URL_PREFIX + '/tree/all',
		api: {
			create: Gtd.core.Constants.API_URL_PREFIX + '/tree/create',
			update: Gtd.core.Constants.API_URL_PREFIX + '/tree/update',
			destroy: Gtd.core.Constants.API_URL_PREFIX + '/tree/remove'
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
	},
	
	/**
	 * @method
	 * @return {String}
	 */
	getFullPath: function() {
		var path = this.get('path');
		var id = String(this.get('id'));
		if (Ext.isEmpty(path)) {
			return id;
		}
		return path + '/' + id;
	},
	
});