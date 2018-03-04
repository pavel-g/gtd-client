/**
 * @class Gtd.store.TaskTree
 * @extends Ext.data.TreeStore
 */
Ext.define('Gtd.store.TaskTree', {

	extend: 'Ext.data.TreeStore',

	requires: ['Gtd.model.TaskTree'],

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
	setListId: function (id) {
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
	getListId: function () {
		if (typeof this.listId === 'number') {
			return this.listId;
		} else {
			return null;
		}
	},

	/**
  * @method
  * @param {Number} taskId
  * @return {Gtd.model.TaskTree/Ext.data.TreeModel/null}
  */
	findTaskById: function (taskId) {
		var index = this.findBy(function (record, id) {
			if (taskId == id) {
				return true;
			}
		});
		return this.getAt(index);
	},

	/**
  * @method
  * 
  * @param {Object} [params]
  * @param {Ext.data.TreeModel} [params.node]
  * 
  * @return {Ext.Promise}
  * @return {Object} return.resolve
  * @return {Ext.data.Model[]} return.resolve.records
  * @return {Ext.data.operation.Operation} return.resolve.operation
  * @return {Boolean} return.resolve.success
  */
	promiseLoad: function (params) {
		params = params || {};
		var me = this;
		return new Ext.Promise(function (resolve, reject) {
			params.callback = function (records, operation, success) {
				return resolve({
					records: records,
					operation: operation,
					success: success
				});
			};
			me.load(params);
		});
	}

});