/**
 * 用于检测浏览器的功能特性
 * @module support.js
 * @submodule base.js
 * @author l.w.kampfer@gmail.com
 */

kampfer.register( 'browser.support', function() {
	
	var support = {
		deleteExpando : true
	};
	
	var div = document.createElement('div');
	
	try{
		delete div.test;
	} catch(e) {
		support.deleteExpando = false;
	}
	
	return support;

});
