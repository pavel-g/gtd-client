Ext.onReady(function() {
	Ext.Loader.setConfig({
		enabled: true,
		disableCaching: false
	});
	Ext.Loader.setPath('Gtd', 'app');
	Ext.require(
		[
			'Gtd.core.Constants',
			'Gtd.core.Ajax',
			'Gtd.MainView',
			'Gtd.core.AuthManager',
			'Gtd.core.LoginWindowManager'
		],
		function() {
			window.mainview = Ext.create('Gtd.MainView');
			Gtd.core.AuthManager.start();
			Gtd.core.LoginWindowManager.init();
		}
	);
});