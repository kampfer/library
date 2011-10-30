/**
 * @Name : tool liberary
 * @Author : l.w.kampfer@gmail.com 
 */

(function( window ) {
	var kampfer = {};
	kampfer.extend = function() {
		var src, target, name, len, i, deep, copyFrom, copyTo, clone;
		i = 1;
		len = arguments.length;
		deep = false;
		target = arguments[0];
		//如果第一个参数为布尔型
		if( typeof target === 'boolean' ) {
			deep = target;
			i = 2;
			target = arguments[1];
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
						target[name] = arguments.callee(deep,clone,copyFrom);
					//如果当前的拷贝模式为浅拷贝（deep=false），或者当前待拷贝的对象属性是基本数据类型，并且已赋值
					} else if( copyFrom !== undefined ){
						target[name] = copyFrom;
					}
				}
			}
		}
		return target;
	};

/******************************************* Utilities ******************************************/
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

/***************************************** Manipulation ****************************************/	
	kampfer.extend( kampfer, {
		getScrollTop : function( obj ) {
			if( kampfer.isWindow( obj) ) {
				return document.documentElement.scrollTop || document.body.scrollTop;
			}
			return obj.scrollTop;
		},
		getScrollLeft : function( obj ) {
			if( kampfer.isWindow( obj) ) {
				return document.documentElement.scrollLeft || document.body.scrollLeft;
			}
			return obj.scrollLeft;
		},
		getHeight : function ( obj ) {
			var value,cssShow,swap;
			if( kampfer.isWindow(obj) ) {
				return document.documentElement.clientHeight;
			}
			if( obj.nodeType === 9 ) {
				return document.documentElement.scrollHeight;
			}
			if( obj.offsetHeight !== 0 ) {
				return obj.offsetHeight;
			} else {
				swap = function (element, options, callback) {
					var old = {};
					for( var name in options ) {
						old[name] = element.style[name];
						element.style[name] = options[name];
					}
					callback.call(element);
					for( name in old ) {
						element.style[name] = old[name];
					}	
				};
				cssShow = {
					position : "absolute",
					visibility : "hidden",
					display : "block"
				};
				swap(obj,cssShow,function() {
					value = obj.offsetHeight;	
				});
				return value;	
			}
		},
		getWidth : function( obj ) {
			var value,cssShow,swap;
			if( kampfer.isWindow(obj) ) {
				return document.documentElement.clientWidth;
			}
			if( obj.nodeType === 9 ) {
				return document.documentElement.scrollWidth;
			}
			if( obj.offsetWidth !== 0 ) {
				return obj.offsetWidth;
			} else {
				swap = function (element, options, callback) {
					var old = {};
					for( var name in options ) {
						old[name] = element.style[name];
						element.style[name] = options[name];
					}
					callback.call(element);
					for( name in old ) {
						element.style[name] = old[name];
					}	
				};
				cssShow = {
					position : "absolute", 
					visibility : "hidden", 
					display : "block"
				};
				swap(obj,cssShow,function() {
					value = obj.offsetWidth;	
				});
				return value;	
			}
		},
		getText : function( elems ) {
			var text = '',
				elem = null;		
			if( elems.length === undefined ) {
				var temp = elems;
				elems = [];
				elems.push( temp );
			}
			for( var i = 0; elems[i]; i++ ) {
				elem = elems[i];
				if( elem.nodeType === 3 || elem.nodeType === 4 ) {
					if( /[^\n\s]/i.test( elem.nodeValue ) ) {
						text += elem.nodeValue;
					}
				} else if( elem.nodeType !== 8 ) {
					text += getText( elem.childNodes );
				}
			}
			return text;
		},
		setText : function( elem, text ) {
			if ( typeof text !== "object" && text !== undefined ) {
				elem.innerHTML = '';
				elem.appendChild( ( elem.ownerDocument || document ).createTextNode( text ) );
			}
		}
	});

/***************************************** CSS ****************************************/
	kampfer.extend( kampfer, {
		addClass : function( element, className ) {
			var rspace = /\s+/;
			if( element.nodeType != 1 || typeof className !== 'string' ) {
				return false;
			}
			if( !element.className ) {
				element.className = className;
				return true;
			}
			var newClass = className.split(rspace),
			setClass = element.className,
			oldClass = ' ' + element.className + ' ';
			for(var i = 0, len = newClass.length; i < len; i++) {
				if( oldClass.indexOf(' ' + newClass[i] + ' ') < 0 ) {
					setClass += ' ' + newClass[i];
				}
			}
			element.className = kampfer.trim( setClass );
			return true;
		},
		removeClass : function( element, className ) {
			var rspace = /\s+/,
				rclass = /[\n\t\r]/g ;
			if( (className && typeof className === "string") || className === undefined ) {
				var newClass = (className || "").split( rspace );
				if ( element.nodeType === 1 && element.className ) {
					if ( className ) {
						var setClass = (" " + element.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = newClass.length; c < cl; c++ ) {
							setClass = setClass.replace(" " + newClass[c] + " ", " ");
						}
						element.className = kampfer.trim( setClass );
					} else {
						element.className = "";
					}
				}
			}
		},
		//ie使用javascript语法，火狐使用css语法
		getStyle : function( element, styleProp ) {
			if ( element.currentStyle ) {
				var y = element.currentStyle[styleProp];
			} else if ( window.getComputedStyle ) {
				var y = document.defaultView.getComputedStyle( element, null ).getPropertyValue( styleProp );
			} else {
				return false;
			}
			return y;
		},
		setStyle : function( element, styleProp, value ) {
			
		}
	});

	if( window.kampfer && window.k ) {
		window.alert('命名空间冲突！');
		return false;
	}
	window.kampfer = window.k = kampfer;
	
})( window );
