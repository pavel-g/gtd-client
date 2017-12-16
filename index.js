Ext.onReady(function() {
	Ext.Loader.setPath('Gtd', 'app');
	Ext.require(['Gtd.core.Constants', 'Gtd.core.Ajax', 'Gtd.MainView'], function() {
		window.mainview = Ext.create('Gtd.MainView');
	});
});