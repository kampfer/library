/*
 *	kampfer - 组件 - 公用函数
 *	@author l.w.kampfer@gmail.com
 *	@depend : core.js
 */

(function( kampfer, window ) {
	kampfer.extend( kampfer, {
		isObject : function( obj ) {
			return obj && Object.prototype.toString.call(obj)==='[object Object]' && 'isPrototypeOf' in obj;
		},
		isArray : function( obj ) {
			return obj && Object.prototype.toString.call(obj) === "[object Array]";
		},
		isWindow : function( obj ) {
			return obj && typeof obj === "object" && "setInterval" in obj;
		},
		trim : function( str ) {
			var trimLeft = /^\s+/,
				trimRight = /\s+$/;
			return str === null ?
			'' :
			str.toString().replace( trimLeft, '' ).replace( trimRight, '' );
		}	
	});
})( kampfer, window );
