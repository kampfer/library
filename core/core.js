/**
 * 函数库核心组件
 * @module core
 * @author l.w.kampfer@gmail.com
 */

(function( window ) {
	
	var kampfer = {};

	kampfer.extend = function() {
		var src, target, name, len, i, deep, copyFrom, copyTo, clone;
		i = 1;
		len = arguments.length;
		deep = false;
		target = arguments[0] || {};
		//如果第一个参数为布尔型
		if( typeof target === 'boolean' ) {
			deep = target;
			i = 2;
			target = arguments[1] || {};
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
	
	if( window.kampfer && window.k ) {
		window.alert('命名空间冲突！');
		return false;
	}
	window.kampfer = window.k = kampfer;

})( window );
