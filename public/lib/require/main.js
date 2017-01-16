require.config({
    baseUrl:"/",
    paths: {
        jquery: '/lib/jquery/jquery-1.11.2.min',
        bootstrap:'/lib/bootstrap/js/bootstrap.min',
        rolling:'/lib/rolling/js/rolling',
        Public:'/javascripts/public',
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