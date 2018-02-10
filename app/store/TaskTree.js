Ext.define('Gtd.store.TaskTree', {
	
	extend: 'Ext.data.TreeStore',
	
	requires: [
		'Gtd.model.TaskTree'
	],
	
	alias: 'store.Gtd.store.TaskTree',
	
	model: 'Gtd.model.TaskTree',
	
	autoSync: true,
	
	autoLoad: false,
	
	defaultRootProperty: 'children',
	
	root: {
		expanded: true
	},
	
	/**
	 * @method
	 * @param {Number} id
	 */
	setListId: function(id) {
		this.listId = id;
		var proxy = this.getProxy();
		if (typeof id !== 'number') {
			delete proxy.getExtraParams().list_id;
		} else {
			proxy.setExtraParam('list_id', id);
		}
	},
	
	/**
	 * @method
	 * @return {Number/null}
	 */
	getListId: function() {
		if (typeof this.listId === 'number') {
			return this.listId;
		} else {
			return null;
		}
	},
	
});