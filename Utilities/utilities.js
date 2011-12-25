/*
 *	kampfer - 组件 - 公用函数
 *	@author l.w.kampfer@gmail.com
 *	@depend : core.js
 */

(function( kampfer, window ) {
	
	var	// 字符串左右空白
		trimLeft = /^\s+/,
		trimRight = /\s+$/,
		
		// 保存一些原生方法
		toString = Object.prototype.toString,
		// String原生trim方法 
		// more : https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
		trim = String.prototype.trim;
	
	kampfer.extend( kampfer, {
		// 判断参数是否是对象字面量，或由构造函数通过new创建的对象
		// more : http://www.iteye.com/topic/663245
		isObject : function( obj ) {
			return obj && toString.call( obj ) === '[object Object]' && 'isPrototypeOf' in obj;
		},
		
		isFunction : function( obj ) {
			return obj && typeof obj === 'function';
		},
		
		isArray : function( obj ) {
			return obj && toString.call( obj ) === "[object Array]";
		},
		
		isWindow : function( obj ) {
			return obj && typeof obj === "object" && "setInterval" in obj;
		},
		
		// 尽可能使用原生trim方法
		// 《高性能javascript》第5章列举了几种非原生的trim方法
		trim : trim ? 
			function( str ) {
				return str === null ?
					'' :
					trim.call( str );
			} : 
			function( str ) {
				return str === null ?
					'' :
					str.toString().replace( trimLeft, '' ).replace( trimRight, '' );
			},
			
		// jQuery.each方法包含第三个参数args，会被传递给callback函数
		each : function( obj, callback ) {
			var name, i,
				length = obj.length,
				isObj = (length === undefined) || kampfer.isFunction( obj );
			if( isObj ) {
				for( name in obj ) {
					if( callback.call( obj[name], name, obj[name] ) === false ) {
						break;
					}
				}
			// 数组， nodeList
			} else {
				for( i = 0; i < length; i++ ) {
					if( callback.call( obj[i], i, obj[i] ) === false ) {
						break;
					}
				}
			}
			return obj;
		},
		
		parseJSON : function() {
			
		},
		
		error : function( e ) {
			console.log( e );
		},
		
		isEmptyObject : function( obj ) {
			for ( var name in obj ) {
				return false;
			}
			return true;
		}
		
	});
	
})( kampfer, window );
