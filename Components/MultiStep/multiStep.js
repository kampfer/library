/**
 * @component multiStep
 * @description : 
 *   使用定时器分割任务，避免ui线程被长时间占用。
 *   改编自《高性能javascript》 第六章
 * @author l.w.kampfer@gmail.com
 * 
 * @param {array} tasks
 * @param {function} process
 * @param {function} callback
 * @return undefined
 */

function multiStep( tasks, process, callback ) {
	var todos = tasks.concat();
	
	//《高性能javascript》代码清单中，任务的第一步使用定时器延迟执行。
	// 我改为使用匿名函数，直接执行第一步。
	//setTimeout( function(){
	(function() {
		
		var start = +new Date();
		
		do {
			process( todos.shift() );
		} while( todos.length > 0 && (+new Date() - start < 50) );
		
		if( todos.length > 0 ) {
			setTimeout( arguments.callee, 25 );
		} else {
			callback( todos );
		}
		
	})();
	//}, 25 );
}
