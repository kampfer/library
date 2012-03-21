/**
 * 为指定DOM元素储存任意数据
 * @module data.js
 * @submodule core.js
 * @author l.w.kampfer@gmail.com
 */

kampfer.require('browser.support');

kampfer.register('data');

kampfer.extend( kampfer.data, {
	cache : {},
		
	cacheId  : 0,
	
	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData : {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},
	
	// 判断是否已经有储存数据
	hasData : function( elem ) {
		if( elem.nodeType ) {
			elem = kampfer.data.cache[ elem[kampfer.expando] ];
			return !!elem && !kampfer.isEmptyObject( elem );
		}
	},
	
	// 判断是否能够储存数据
	// jQuery中同时允许对DOM对象和原生对象进行操作
	// 但是对原生对象的操作多余，且存在问题，所以不采用这种用法
	// 更多: http://www.denisdeng.com/?p=805
	acceptData : function( elem ) {
		var result = false;
		// 判断DOM元素
		if( elem.nodeName ) {
			result = kampfer.data.noData[ elem.nodeName.toLowerCase() ];
			if( result ) {
				result = !(result === true || elem.getAttribute('classid') !== result);
			} else {
				result = true;
			}
		}
		return result;
	},
	
	// 读取、储存数据 （kampfer内部使用）
	_data : function( elem, name, value, inInternal ) {
		
		if( !kampfer.data.acceptData( elem ) ) {
			return;
		}
		
		var expando = kampfer.data.expando,
			getByName = typeof name === 'string',
			cache = kampfer.data.cache,
			cacheId = elem[expando],
			ret, thisCache;
		
		// 尝试读取未储存数据的DOM对象
		if( (!cacheId || !cache[cacheId]) && getByName && value === undefined ) {
			return;
		}
		
		if( !cacheId ) {
			elem[expando] = cacheId = ++kampfer.data.cacheId;
		}
		
		if( !cache[cacheId] ) {
			cache[cacheId] = {};
		}
		
		thisCache = cache[cacheId];
		
		if( typeof name === 'object' ) {
			if( !inInternal ) {
				thisCache.data = kampfer.extend( thisCache.data, name );
			} else {
				thisCache = kampfer.extend( thisCache, name );
			}
		}
		
		// 用户调用data方法时，数据存储在thisCache.data中
		// 避免用户定义的数据与kampfer内部定义的数据冲突
		if( !inInternal ) {
			if( !thisCache.data ) {
				thisCache.data = {};
			}
			thisCache = thisCache.data;
		}
		
		if( value !== undefined ) {
			thisCache[name] = value;
		}
		
		if( getByName ) {
			ret = thisCache[name];
		} else {
			ret = thisCache;
		}
		
		return ret;
		
	},
	
	_removeData : function( elem, name, inInternal ) {
		
		if( !kampfer.data.acceptData( elem ) ) {
			return;
		}
		
		var expando = kampfer.data.expando,
			cacheId = elem[expando],
			cache = kampfer.data.cache,
			thisCache;
			
		if( !cacheId || !cache[cacheId] ) {
			return;
		}
		
		if( name ) {
			thisCache = inInternal ? cache[cacheId] : cache[cacheId].data;
			if( thisCache ) {
				if( !kampfer.isArray(name) ) {
					if( name in thisCache ) {
						name = [name];
					}
				}
				for( var i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[name[i]];
				}
				if( !kampfer.isEmptyObject( thisCache ) ) {
					return;
				}
			}
		}
		
		if( !inInternal ) {
			delete cache[cacheId].data;
		}
		if( kampfer.isEmptyObject( cache[cacheId] ) ) {
			delete cache[cacheId];
		}
		
		// IE does not allow us to delete expando properties from nodes,
		// nor does it have a removeAttribute function on Document nodes;
		// we must handle all of these cases
		if ( kampfer.browser.support.deleteExpando ) {
			delete elem[ expando ];
		} else if ( elem.removeAttribute ) {
			elem.removeAttribute( expando );
		} else {
			elem[ expando ] = null;
		}
		
	},
	
	data : function( elem, name, value ) {
		return kampfer.data._data( elem, name, value );
	},
	
	removeData : function( elem, name ) {
		return kampfer.data._removeData( elem, name );
	}
	
});