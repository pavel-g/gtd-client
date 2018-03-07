/**
 * @class Gtd.view.mixins.GetChildCmp
 */
Ext.define('Gtd.view.mixins.GetChildCmp', {
	
	/**
	 * @method
	 * @param {string} refName
	 * @return {Ext.Component/null}
	 */
	getChildCmp: function(refName) {
		var els = this.query('[reference="' + refName + '"]');
		if (els && els.length > 0) {
			return els[0];
		}
		return null;
	},
	
});