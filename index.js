Ext.onReady(function() {
	Ext.Loader.setPath('Gtd', 'app');
	Ext.require('Gtd.MainView', function() {
		window.mainview = Ext.create('Gtd.MainView');
	});
});