Ext.require(['Gtd.core.RepeatTypes'], function() {

/**
 * @class Gtd.store.RepeatTypes
 * @extends Ext.data.Store
 */
Ext.define('Gtd.store.RepeatTypes', {
	extend: 'Ext.data.Store',
	alias: 'store.Gtd.store.RepeatTypes',
	fields: ['type', 'name'],
	data: [
		{
			type: Gtd.core.RepeatTypes.BY_HAND_REPEAT,
			name: 'Вручную'
		},
		{
			type: Gtd.core.RepeatTypes.AUTO_REPEAT,
			name: 'Автоматически'
		}
	]
});

});