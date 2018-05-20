/**
 * @class Gtd.core.RepeatTypes
 * @singleton
 */
Ext.define('Gtd.core.RepeatTypes', {
	singleton: true,
	AUTO_REPEAT: 'AUTO_REPEAT',
	BY_HAND_REPEAT: 'BY_HAND_REPEAT',
	
	/**
	 * @method
	 * @static
	 * @return {String[]}
	 */
	getTypes: function() {
		return [
			this.AUTO_REPEAT,
			this.BY_HAND_REPEAT
		];
	}
	
});