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
		{name: 'due', type: 'date', allowNull: true},
		{name: 'hashtags', allowNull: true},
		{name: 'repeat_rule', allowNull: true},
		{name: 'priority', allowNull: true},
		{name: 'start', type: 'date', allowNull: true},
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
			messageProperty: 'message',
			transform: function(data) {
				if (!data.data) {
					return data; 
				}
				Ext.Array.each(data.data, function(item) {
					if (typeof item.hashtags === 'string') {
						item.hashtags = JSON.parse(item.hashtags);
					}
					if (typeof item.repeat_rule === 'string') {
						item.repeat_rule = JSON.parse(item.repeat_rule);
					}
				});
				return data;
			}
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
	
	/**
	 * @method
	 * @return {String}
	 */
	getHashtagsAsString: function() {
		var value = this.get('hashtags');
		return value ? value.join(',') : '';
	},
	
	/**
	 * @method
	 * @param {String} value
	 * @param {Object} params
	 */
	setHashtagsFromString: function(value, params) {
		params = params || {};
		var values = value.split(',');
		for (var i in values) {if (values.hasOwnProperty(i)) {
			values[i] = values[i].trim();
		}}
		this.set('hashtags', values, params);
	},
	
	/**
	 * @method
	 * @param {Boolean} check
	 * @param {String} [type]
	 * @param {Number} [interval]
	 */
	setRepeatRuleFromEditor: function(check, type, interval) {
		if (!check) {
			this.set('repeat_rule', null);
			return;
		}
		var types = Gtd.core.RepeatTypes.getTypes();
		if (types.indexOf(type) < 0) {
			throw new Error('Wrong value of "type');
		}
		var value = {
			type: type
		};
		if (type === Gtd.core.RepeatTypes.BY_HAND_REPEAT) {
			this.set('repeat_rule', value);
			return;
		}
		if (!Ext.isNumeric(interval)) {
			throw new Error('Wrong value of "interval"');
		}
		value.interval = Number(interval);
		this.set('repeat_rule', value);
	},
	
	/**
	 * @method
	 * @return {Object}
	 * @return {Boolean} return.check
	 * @return {String} return.type
	 * @return {Number} return.interval
	 */
	getRepeatRuleForEditor: function() {
		var repeatRule = this.get('repeat_rule');
		if (Ext.isEmpty(repeatRule)) {
			return {check: false};
		}
		var res = {
			check: true
		};
		var type = repeatRule.type;
		var types = Gtd.core.RepeatTypes.getTypes();
		if (types.indexOf(type) < 0) {
			throw new Error('Wrong value of "type"');
		}
		res.type = type;
		if (type === Gtd.core.RepeatTypes.AUTO_REPEAT) {
			res.interval = Number(repeatRule.interval);
		}
		return res;
	},
	
});