require.config({
    baseUrl:"/",
    paths: {
        jquery: '/javascripts/jquery-1.11.2.min',
        bootstrap:'/bootstrap/js/bootstrap.min',
        rolling:'/rolling/js/rolling',
        Public:'/javascripts/Public',
        io:'/javascripts/io'
    }
});
 
// require(['jquery','socket','bootstrap','rolling','Public','io']);
require(['jquery'],function () {
	require(['bootstrap', 'rolling'],function(){
		require(['Public'],function(){
			require(['io']);
		});
	});
});
// require(['socket']);
// require(['bootstrap']);
// require(['rolling']);
// require(['Public']);
// require(['io']);