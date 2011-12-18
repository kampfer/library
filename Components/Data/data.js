/**
 * 为指定DOM元素储存任意数据
 * @module data.js
 * @submodule core.js
 * @author l.w.kampfer@gmail.com
 */

(function( kampfer ) {
	
	var hasOwn = Object.prototype.hasOwnProperty;
	
	function isEmptyDataObject( obj ) {
		for( var name in obj ) {
			return false;
		}
		return true;
	}
	
	kampfer.extend( kampfer, {
		
		cache : {},
		
		cacheId  : 0,
		
		expando : 'kampfer' + (+new Date()),
		
		// The following elements throw uncatchable exceptions if you
		// attempt to add expando properties to them.
		noData : {
			"embed": true,
			// Ban all objects except for Flash (which handle expandos)
			"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			"applet": true
		},
		
		// 判断是否已经储存数据
		hasData : function( elem ) {
			elem = elem.nodeType ?
				kampfer.cache[ elem[kampfer.expando] ] :
				elem[kampfer.expando];
			return !!elem && !isEmptyDataObject( elem );
		},
		
		// 判断是否能够储存数据
		// jQuery中同时允许对DOM对象和原生对象进行操作
		// 但是对原生对象的操作多余，且存在问题，故我抛弃这种用法
		// 更多: http://www.denisdeng.com/?p=805
		acceptData : function( elem ) {
			var result;
			// 判断DOM元素
			if( elem.nodeName ) {
				result = kampfer.noData[ elem.nodeName.toLowerCase() ];
				if( result ) {
					result = !(result === true || elem.getAttribute('classid') !== result);
				} else {
					result = true;
				}
			} else {
				result = false;
			}
			return result;
		},
		
		// 读取、储存数据
		data : function( elem, name, value, inInternal ) {
			
			if( !kampfer.acceptData( elem ) ) {
				return;
			}
			
			var expando = kampfer.expando,
				getByName = typeof name === 'string',
				cache = kampfer.cache,
				cacheId = elem[expando],
				ret;
			
			// 尝试读取未储存数据的DOM对象	
			if( (!cacheId || !cache[cacheId]) && getByName && value === undefined ) {
				return;
			}
			
			if( !cacheId ) {
				elem.expando = cacheId = ++kampfer.cacheId;
			}
			
			if( !cache[cacheId] ) {
				cache[cacheId] = {};
			}
			
			if( inInternal ) {
				if( !cache[cacheId].data ) {
					cache[cacheId].data = {};
				}
			}
			
			if( typeof name === 'object' ) {
				if( inInternal ) {
					cache[cacheId].data = kampfer.extend( cache[cacheId].data, name );
				} else {
					cache[cacheId] = kampfer.extend( cache[cacheId], name );
				}
			}
			
			if( value !== undefined ) {
				thisCache[name] = value;
			}
			
			if( getByName ) {
				ret = cache[cacheId][name];
			} else {
				ret = cache[cacheId];
			}
			
			return ret;
			
		},
		
		removeData : function( elem, name ) {
			
		}
		
	});
	
})( kampfer );

