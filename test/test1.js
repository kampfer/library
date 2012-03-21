/**
 * @author liaowei
 */

kampfer.require('data');

kampfer.register( 'test1', function($) {
	
	var div = document.getElementById('div_one');
	
	console.log(div);
	
	console.log($);
	
	console.log($.data.hasData( div ));
	
});

