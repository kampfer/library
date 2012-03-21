/*
 * @Author : l.w.kampfer@gmail.com 
 */

(function() {
	
	/**
	 * 定义命名空间kampfer。所有需要公开的属性和方法都被将绑定在kampfer上。
	 * 最后将检查全局变量，并把kampfer绑定到全局变量上
	 */
	var kampfer = {};
	
	
	/**
	 * @define	{boolean}	标记是否启用异步模式。
	 * 如果启用，那么reuqire方法将会试图异步的将依赖的js文件排序后插入到文档中。
	 * 如果禁用，那么需要第三方的打包程序来完成依赖文件的排序和加载。
	 * TODO	目前只能使用异步模式，以后会添加第三方打包程序的支持。
	 */
	kampfer.ENABLE_ASYNC_LOADER = true;
	
	
	/**
	 * @define	{object}	保存一个对全局对象的引用。
	 * 一般情况下指向window对象。
	 */
	kampfer.global = this;
	
	
	/**
	 * @define {string}		js路径
	 * 在异步加载js文件的时候使用
	 */
	kampfer.basePath = '';
	
	
	/**
	 *  私有变量
	 */
	var _toString = Object.prototype.toString,
		_class2type = {},
		_implicitNamespaces = {},
		_included = {};
	
	
	/**
	 * 在kampfer上注册模块。
	 * @param	name{string}	模块名。以文件路径来命名，如'a.b.c'
	 * @param	comp{*}		赋予模块的值。
	 */
	kampfer.register = function( name, comp ) {
		
		if( kampfer.ENABLE_ASYNC_LOADER ) {
			var namespace;
			if( kampfer.isRegistered(name) ) {
				return false;
			} else {
				delete _implicitNamespaces[name];
			}
			namespace = name;
			while( (namespace = namespace.substring( 0, namespace.lastIndexOf('.') )) ) {
				if( kampfer.getPropertyByName(namespace) ) {
					break;
				} else {
					_implicitNamespaces[namespace] = true;
				}
			}
		}
		
		if( kampfer.type(comp) === 'function' ) {
			kampfer.exportNamespace( name, comp.call( kampfer.global, kampfer ), kampfer );
		} else {
			kampfer.exportNamespace( name, comp, kampfer );
		}
		
	};
	
	
	/**
	 * 定义模块所依赖的模块。这个模块稍后会被异步的加载到页面。
	 * @TODO	将来会配合后台，在服务器端读取require来合并js文件。
	 * @param	name{string}	依赖的模块名
	 */
	kampfer.require = function(name) {
		
		if( kampfer.ENABLE_ASYNC_LOADER ) {
			if ( !name || kampfer.isRegistered(name) ) {
				return;
			}
			
			var path = kampfer._getPathFromDeps(name);
			if (path) {
				_included[path] = true;
				kampfer._writeScripts();
				return;
			}
		}
		
	};
	
	
	/**
	 * 在kampfer上添加js模块依赖关系的记录。
	 * @param	names{array/string}	模块名，可以是一个（string）也可以是多个（array）
	 * @param	path{string}	模块的真实路径（window）
	 * @param	requires{array/string}	模块依赖的模块，可以是一个（string）也可以是多个（array）
	 */
	kampfer.addDependency = function( names, path, requires ) {
		
		if( kampfer.ENABLE_ASYNC_LOADER ) {
			
			var provide, require, deps;
			path = path.replace(/\\/g, '/');
			deps = kampfer._dependencies;
			
			if( !names || !path ) {
				return false;
			}
			
			if( kampfer.type(names) !== 'array' ) {
				names = [names];
			}
			
			if( kampfer.type(requires) === 'undefined' ) {
				requires = [];
			} else if( kampfer.type(requires) !== 'array' ) {
				requires = [requires];
			}
			
			for( var i = 0; (provide = names[i]); i++) {
				deps.nameToPath[provide] = path;
				if (!(path in deps.pathToNames)) {
					deps.pathToNames[path] = {};
				}
				deps.pathToNames[path][provide] = true;
			}
			
			for( var j = 0; (require = requires[j]); j++) {
				if (!(path in deps.requires)) {
					deps.requires[path] = {};
				}
				deps.requires[path][require] = true;
			}
			
		}
			
	};
	
	
	/**
	 * 注册命名空间。默认在kampfer.global上注册。也可以指定其他对象。
	 * @param	ns{string}	命名空间名字
	 * @param	object{*}	赋给名空间的值，默认为空对象。
	 * @param	objectToExportTo{object}	命名空间的宿主对象。默认为kampfer.global
	 */
	kampfer.exportNamespace = function( ns, object, objectToExportTo ) {
		var cur = objectToExportTo || kampfer.global,
			namespace = ns.split('.'),
			name;
		for( var part; (part = namespace.shift()); ) {
			if( !namespace.length && kampfer.isDefAndNotNull(object) ) {
				cur[part] = object;
			} else if( cur[part] ) {
				cur = cur[part];
			} else {
				cur = cur[part] = {};
			}
		}
	};
	
	
	/**
	 * 判断给定的命名空间是否已经通过register方法初始化。判断条件如下：
	 * 1.命名空间没有被隐性的声明（不在_implicitNamespaces中）
	 * 2.命名空间非空
	 * @param	ns{string}	命名空间的名字
	 * @return	{boolean}	已经被注册过，则为true；反之为false
	 */
	kampfer.isRegistered = function(ns) {
		return !_implicitNamespaces[ns] && !!kampfer.getPropertyByName(ns);
	};
	
	
	/**
	 * 通过名字找到指定对象上的某个属性的值
	 * @param	name{string}	命名空间的名字
	 * @param	obj{object}		目标对象，将在这个对象上查找给定的名字空间。
	 * @return	{*}
	 */
	kampfer.getPropertyByName = function( name, obj ) {
		var namespace = name.split('.'),
			cur = obj || kampfer;
		for( var part; (part = namespace.shift()); ) {
			if( kampfer.isDefAndNotNull( cur[part] ) ) {
				cur = cur[part];
			} else {
				return null;
			}
		}
		return cur;
	};
	
	 
	kampfer.inHtmlDocument = function() {
		var doc = kampfer.global.document;
		return typeof doc != 'undefined' &&
			'write' in doc;  // XULDocument misses write.
	};
	
	
	if( kampfer.ENABLE_ASYNC_LOADER ) {
		
		/**
		 * 通过模块名从kampfer保存的依赖性列表中获得真实文件路径
		 * @param	name{string}	模块的名称
		 * @return	{string}	模块的真实路径地址
		 */
		kampfer._getPathFromDeps = function(name) {
			if( name in kampfer._dependencies.nameToPath ) {
				return kampfer._dependencies.nameToPath[name];
			} else {
				return null;
			}
		};


		/**
		 * 决定使用什么方式添加script标签，默认使用document.write。
		 * 记录已经加载的js。
		 * @param	src{string}	js的完整路径
		 */
		kampfer._importScript = function(src) {
			var _importScript = kampfer.global.CLOSURE_IMPORT_SCRIPT || kampfer._writeScriptTag;
			if(!kampfer._dependencies.written[src] && _importScript(src)) {
				kampfer._dependencies.written[src] = true;
			}
		};
		
		
		/**
		 * 对依赖关系进行拓扑排序，决定js文件正确的输出顺序，并异步的加载js文件
		 * 详细算法：http://en.wikipedia.org/wiki/Topological_sorting
		 */
		kampfer._writeScripts = function() {
		
			var scripts = [],
				seenScript = {},
				deps = kampfer._dependencies;
			
			function visitNode(path) {
				if( path in deps.written ) {
					return;
				}
		
				// 如果已经访问过次节点
				if( path in deps.visited ) {
					if( !(path in seenScript) ) {
						seenScript[path] = true;
						scripts.push(path);
					}
					return;
				}
		
				deps.visited[path] = true;
		
				if (path in deps.requires) {
					for (var requireName in deps.requires[path]) {
						// 如果依赖的模块已经注册（假设它已经被正确的加载），那么将不会再加载该模块。
						if (!kampfer.isRegistered(requireName)) {
							if (requireName in deps.nameToPath) {
								visitNode(deps.nameToPath[requireName]);
							} else {
								throw Error('Undefined nameToPath for ' + requireName);
							}
						}
					}
				}
		
				if (!(path in seenScript)) {
					seenScript[path] = true;
					scripts.push(path);
				}
			}
		
			for( var path in _included ) {
				if( !deps.written[path] ) {
					visitNode(path);
				}
			}
		
			for( var i = 0; i < scripts.length; i++ ) {
				if ( scripts[i] ) {
					kampfer._importScript( kampfer.basePath + scripts[i] );
				} else {
					throw Error('Undefined script input');
				}
			}
		};
		

		/**
		 * 输出script标签，异步的引入js
		 * TODO	改用标准的DOM插入方法来添加script标签，而不使用document.write方法
		 * @param	src{string}	js文件的url
		 * @return	{boolean}	成功返回true，失败返回false
		 */
		kampfer._writeScriptTag = function(src) {
			if( kampfer.inHtmlDocument() ) {
				var doc = kampfer.global.document;
				doc.write('<script type="text/javascript" src="' + src + '"></' + 'script>');
				return true;
			} else {
				return false;
			}
		};
		
		
		/**
		 * 通过遍历页面的script标签，找到js的路径地址 
		 */
		kampfer._findBasePath = function() {
			if(kampfer.global.CLOSURE_BASE_PATH) {
				kampfer.basePath = kampfer.global.CLOSURE_BASE_PATH;
				return;
			} else if( !kampfer.inHtmlDocument() ) {
				return;
			}
			var doc = kampfer.global.document;
			var scripts = doc.getElementsByTagName('script');
			for (var i = scripts.length - 1; i >= 0; --i) {
				var src = scripts[i].src;
				var qmark = src.lastIndexOf('?');
				var l = qmark == -1 ? src.length : qmark;
				if (src.substr(l - 7, 7) == 'base.js') {
					kampfer.basePath = src.substr(0, l - 7);
					return;
				}
			}
		};
		
		kampfer._dependencies = {
			pathToNames: {},	// 1 to many
			nameToPath: {},		// 1 to 1
			requires: {},		// 1 to many
			visited: {},		// 避免在拓扑排序时循环访问同一个节点。访问过的节点将保存在这里
			written: {}			// 记录已经被加载到页面的js文件名
		};
		
		kampfer._findBasePath();
		
		kampfer._importScript( kampfer.basePath + 'deps.js'	);
		
	}

	
	
//=====================================================================================
// 工具函数
//=====================================================================================
	
	/**
	 * Returns true if the specified value is not |undefined|.
	 * WARNING: Do not use this to test if an object has a property. Use the in
	 * operator instead.  Additionally, this function assumes that the global
	 * undefined variable has not been redefined.
	 * @param {*} val Variable to test.
	 * @return {boolean} Whether variable is defined.
	 */
	kampfer.isDef = function(val) {
		return val !== undefined;
	};
	
	
	/**
	 * 检查给定的参数是否被定义，且不为空值。
	 */
	kampfer.isDefAndNotNull = function(val) {
		return val != null;
	};
	
	
	/**
	 * 原生typeof方法的替代方案。kampfer.type可以区分array、null等。
	 * @param	value{*}	待检测的目标
	 * @return	{string}
	 */
	kampfer.type = function(value) {
		return value == null ?
			String(value) :
			_class2type[ _toString.call(value) ] || 'object';
	};
	
	
	/**
	 * Returns true if the specified value is an array
	 * @param val{*} Variable to test.
	 * @return {boolean} Whether variable is an array.
	 */
	kampfer.isArray = function(val) {
		return kampfer.type(val) === 'array';
	};
	
	
	/**
	 * Returns true if the specified value is an object. 
	 * This included DOM nodes and native Object.
	 * @param val{*}  Variable to test.
	 * @return {boolean} Whether variable is an object.
	 */
	kampfer.isObject = function(val) {
		return kampfer.type(val) === 'object';
	};
	
	
	/**
	 * Return true if the specified object has no property included
	 * property inherit from prototype.
	 * @param val{object}	Object to test.
	 * @return {boolean}	Whether Object is empty.
	 */
	kampfer.isEmptyObject = function(val) {
		if( kampfer.type(val) !== 'object' ) {
			return;
		}
		for( var name in val ) {
			return false;
		}
		return true;
	};
	
	
	/**
	 * 迭代函数。只能针对数组使用。
	 * @param	array{array}	需要执行迭代的数组
	 * @param	fn{function}	迭代时执行的函数。将会被依次传递如下参数：
	 *		@param	{number}	当前正在被操作的数组项的索引
	 *		@param	{*}	当前正在被操作的数组项的值
	 *		@param	{array}	整个迭代数组
	 * @param	thisObj{object}	迭代函数的执行上下文。默认为kampfer.global。
	 */
	kampfer.each = function( array, fn, thisObj ) {
		for( var i = 0, len = (array && array.length) || 0; i < len; ++i ) {
			// 注意：array可以是一个类似数组的对象，所以这里添加一个in判断，
			// 避免在array[i] undefined的情形下依然迭代一次。
			if( i in array ) {
				fn.call( thisObj || kampfer.global, i, array[i], array );
			}
		}
	};
	
	
	/**
	 *	拷贝对象属性。当传递多个对象时，所有属性将被拷贝到第一个对象上。
	 *	当只传递了一个对象时，会将该对象的属性直接拷贝到kampfer对象上。
	 *	当第一个参数是布尔类型时：ture为深拷贝，false为浅拷贝。默认为
	 *	浅拷贝。
	 *	@param	{boolean}	true深拷贝，false浅拷贝
	 *	@param	{object}	需要拷贝的对象
	 *	@return	{object}
	 */
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
					if( deep && copyFrom && ( kampfer.isArray(copyFrom) || 
						kampfer.isObject(copyFrom) ) ) {
						if( kampfer.isArray(copyFrom) ) {
							clone = copyTo && kampfer.isArray(copyTo) ? copyTo : [];
						} else if( kampfer.isObject(copyFrom) ) {
							clone =	copyTo && kampfer.isObject(copyTo) ? copyTo : {};
						}
						target[name] = kampfer.extend( deep, clone, copyFrom );
					//如果当前的拷贝模式为浅拷贝（deep=false），
					//或者当前待拷贝的对象属性是基本数据类型，并且已赋值
					} else if( copyFrom !== undefined ) {
						target[name] = copyFrom;
					}
				}
			}
		}
		
		return target;
		
	};
	
	
	//保存一个空函数的引用
	kampfer.emptyFn = function() {};
	
	
	//返回当前时间戳
	kampfer.now = function() {
		return +new Date();
	};
	
	
	//为kampfer设置一个唯一的标识
	kampfer.expando = 'kampfer' + kampfer.now();
	
	
	/**
	 * 初始化操作
	 */
	//初始化_class2type列表
	kampfer.each( "Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		_class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	
	//输出kampfer对象
	if( kampfer.type( kampfer.global.kampfer ) != 'undefined' ) {
		kampfer._kampfer = kampfer.global.kampfer;
	}
	if( kampfer.type( kampfer.global.k ) != 'undefined' ) {
		kampfer._k = kampfer.global.k;
	}
	kampfer.global.kampfer = kampfer.global.k = kampfer;
	
})();
