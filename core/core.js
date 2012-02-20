/**
 * 函数库核心组件
 * @module core
 * @author l.w.kampfer@gmail.com
 */

(function( window ) {
	
	var kampfer = {},
		_DOMContentLoaded,
		isDOMReady = false,
		readyList = [],
		toplevel = false,
		document = window.document,
		toString = Object.prototype.toString,
		// String原生trim方法 
		// more : https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
		trim = String.prototype.trim,
		rdigit = /\d/;

	kampfer.extend = function() {
		
		var src, target, name, len, i, deep, copyFrom, copyTo, clone;
		i = 1;
		len = arguments.length;
		deep = false;
		target = arguments[0] || {};
		
		// 如果第一个参数为布尔型
		if( typeof target === 'boolean' ) {
			deep = target;
			i = 2;
			target = arguments[1] || {};
		}
		
		// 如果只传递了一个参数，就添加到kampfer上
		if( i === len ) {
			target = this;
			--i;
		}
		
		for( ; i < len; i++ ) {
			src = arguments[i];
			if( src !== null ) {
				for( name in src ) {
					copyFrom = src[name];
					copyTo = target[name];
					//如果目标对象已经拥有和当前待拷贝的对象属性 值 相同的属性
					if( copyTo === copyFrom ) {
						continue;
					}
					//如果deep为true，并且当前待拷贝的对象属性是数组或者对象
					if( deep && copyFrom && ( kampfer.isArray(copyFrom) || kampfer.isObject(copyFrom) ) ) {
						if( kampfer.isArray(copyFrom) ) {
							clone = copyTo && kampfer.isArray(copyTo) ? copyTo : [];
						} else if( kampfer.isObject(copyFrom) ) {
							clone =	copyTo && kampfer.isObject(copyTo) ? copyTo : {};
						}
						target[name] = kampfer.extend( deep, clone, copyFrom );
					//如果当前的拷贝模式为浅拷贝（deep=false），或者当前待拷贝的对象属性是基本数据类型，并且已赋值
					} else if( copyFrom !== undefined ) {
						target[name] = copyFrom;
					}
				}
			}
		}
		
		return target;
		
	};
	
	kampfer.extend( kampfer, {
		
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
		
		isNaN : function( obj ) {
			return obj == null || !rdigit.test( obj ) || isNaN( obj );
		},
		
		isEmptyObject : function( obj ) {
			for ( var name in obj ) {
				return false;
			}
			return true;
		},
		
		emptyFn : function() {},
		
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
		
		register : function( ns, comp ) {
			var nameList = ns.split('.'),
				name,
				step = kampfer,
				type = typeof comp;
			for( var i = 0, l = nameList.length; i < l; i++ ) {
				name = nameList[i];
				if( i === l - 1 ) {
					if( step[name] !== undefined ) {
						return false;
					}
					if( type === 'function' ) {
						step[name] = comp.call( null, this );
					} else {
						step[name] = comp;
					}
					break;
				}
				if( step[name] === undefined ) {
					step[name] = {};
				}
				step = step[name];
			}
		},
		
		onReady : function( fn ) {
			if(isDOMReady) {
				fn();
			} else {
				readyList.push(fn);
			}
		}
		
	});
	
	function _fireReady() {
		if( !isDOMReady ) {
			isDOMReady = true;
			for( var i = 0, l = readyList.length; i < l; i++ ) {
				readyList[i]();
			}
		}
	}

	function _doScrollCheck() {
		if(isDOMReady) {
			return;
		}
		try {
			document.documentElement.doScroll("left");
		} catch(e) {
			setTimeout( _doScrollCheck, 0 );
			return;
		}
		_fireReady();
	}

	if( document.addEventListener ) {
		_DOMContentLoaded = function() {
			document.removeEventListener( "DOMContentLoaded", _DOMContentLoaded, false );
			_fireReady();
		};
	} else if( document.attachEvent ) {
		_DOMContentLoaded = function() {
			if( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", _DOMContentLoaded );
				_fireReady();
			}
		};
	}

	if( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", _DOMContentLoaded, false );
		window.addEventListener( "load", _fireReady, false );
	} else if( document.attachEvent ) {
		// ie document.onreadystatechange事件和onload事件类似，在所有资源加载完毕后触发
		document.attachEvent( "onreadystatechange", _DOMContentLoaded );
		window.attachEvent( "onload", _fireReady );
		
		try {
		// frameElement Retrieves the frame or iframe object that is hosting the window in the parent document.
			toplevel = ( window.frameElement == null );
		} catch(e) {}

		if( toplevel && document.documentElement.doScroll ) {
			_doScrollCheck();
		}
	}
	
	if( window.kampfer && window.k ) {
		window.alert('命名空间冲突！');
		return false;
	}
	window.kampfer = window.k = kampfer;

})( window );
