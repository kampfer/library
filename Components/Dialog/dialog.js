/*
 * Dialog Plug-in
 * version 1.0.0
 * AUTHOR l.w.kampfer@gmail.com
 * Last modified 2011-7-4
 */
(function() {
	/**************** 工具函数  S ****************/
	function isObject(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj;
	}

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === "[object Array]";
	}

	function isWindow(obj) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	}

	function extend() {
		var src,target,name,len,i,deep,copyFrom,copyTo,clone;
		i = 1;
		len = arguments.length;
		deep = false;
		target = arguments[0];
		if( typeof target === 'boolean' ) {
			deep = target;
			i = 2;
			target = arguments[1];
		}
		for( ; i < len; i++ ) {
			src = arguments[i];
			if( src != null ) {
				for( name in src ) {
					copyFrom = src[name];
					copyTo = target[name];
					if( copyTo === copyFrom ) {
						continue;
					}
					if( deep && copyFrom && ( isArray(copyFrom) || isObject(copyFrom) ) ) {
						if( isArray(copyFrom) ) {
							clone = copyTo && isArray(copyTo) ? copyTo : [];
						} else if( isObject(copyFrom) ) {
							clone =	copyTo && isObject(copyTo) ? copyTo : {};
						}
						target[name] = arguments.callee(deep,clone,copyFrom);
					} else if( copyFrom != undefined ) {
						target[name] = copyFrom;
					}
				}
			}
		}
		return target;
	}

	function trim(text) {
		var trimLeft = /^\s+/,
		trimRight = /\s+$/;
		return text === null ?
		'' :
		text.toString().replace( trimLeft, '' ).replace( trimRight, '' );
	}

	function addClass(element,className) {
		var rspace = /\s+/;
		if( element.nodeType != 1 || typeof className !== 'string' )
			return false;
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
		element.className = trim( setClass );
		return true;
	}

	function removeClass(element,className) {
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
					element.className = trim( setClass );
				} else {
					element.className = "";
				}
			}
		}
	}

	function getScrollTop(obj) {
		if( isWindow(obj) ) {
			return document.documentElement.scrollTop || document.body.scrollTop;
		}
		return obj.scrollTop;
	}

	function getScrollLeft(obj) {
		if( isWindow(obj) ) {
			return document.documentElement.scrollLeft || document.body.scrollLeft;
		}
		return obj.scrollLeft;
	}

	function getHeight(obj) {
		var value,cssShow,swap;
		if( isWindow(obj) ) {
			return document.documentElement.clientHeight;
		}
		if( obj.nodeType === 9 ) {
			return document.documentElement.scrollHeight;
		}
		if( obj.offsetHeight != 0 ) {
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
	}

	function getWidth(obj) {
		var value,cssShow,swap;
		if( isWindow(obj) ) {
			return document.documentElement.clientWidth;
		}
		if( obj.nodeType === 9 ) {
			return document.documentElement.scrollWidth;
		}
		if( obj.offsetWidth != 0 ) {
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
	}

	/**************** 工具函数  E ****************/
	/**************** 私有函数 S ****************/
	function beCenter( element ) {
		var wWidth = getWidth( window ),
			wHeight = getHeight( window ),
			eWidth = getWidth( element ),
			eHeight = getHeight( element ),
			sLeft = getScrollLeft( window ),
			sTop = getScrollTop( window ),
			left,top;
		//alert(sLeft+' '+sTop);
		//alert(eWidth+' '+eHeight);
		left = sLeft + ( wWidth - eWidth )/2;
		top = sTop + ( wHeight - eHeight )/2;
		element.style.position = 'absolute';
		element.style.left = left + 'px';
		element.style.top = top + 'px';
	}
	/**************** 私有函数  E ****************/
	/**************** Dialog类  S ****************/
	function Dialog(obj) {
		this.dialogBox = obj;
	}

	Dialog.prototype = {
		dialogOverLay : document.createElement('div'),
		defaultOptions : {
			title : '',
			width : 300,
			height : 'auto',
			modal :　'normal',
			dialogClass : '',
			zIndex : 1000
		},
		init : function(options) {
			this.options = extend({},this.defaultOptions,options);
			//创建dom组建
			var fragment = document.createDocumentFragment();
			var wraper = document.createElement('div');
			var titleBar = document.createElement('div');
			var content = document.body.removeChild(this.dialogBox);
			var close = document.createElement('a');
			var title = document.createElement('span');
			//添加样式名
			addClass(wraper,'dialog_box');
			addClass(titleBar,'dialog_title_bar');
			addClass(content,'dialog_content');
			addClass(close,'dialog_close');
			addClass(this.dialogOverLay,'dialog_overLay');
			addClass(title,'dialog_title');
			//组装dom组建
			titleBar.appendChild(close);
			title.appendChild( document.createTextNode(this.options.title) );
			titleBar.appendChild(title);
			wraper.appendChild(titleBar);
			wraper.appendChild(content);
			fragment.appendChild(wraper);
			fragment.appendChild(this.dialogOverLay);
			//更新option
			if( this.options.dialogClass ) addClass( wraper, this.options.dialogClass );
			wraper.style.width = this.options.width + 'px';
			wraper.style.height = this.options.height === 'auto' ? this.options.height : this.options.height + 'px';
			wraper.style.zIndex = this.options.zIndex;
			//更新dom
			document.body.appendChild(fragment);
			//
			this.dialogBox = wraper;
			close.dialogBox = wraper;
			this.dialogContent = content;
			//
			close.onclick = this.close;
		},
		open : function() {
			beCenter( this.dialogBox );
			this.dialogBox.style.display = 'block';
		},
		close : function() {
			this.dialogBox.style.display = 'none';
		},
		setContent : function( str ) {
			this.dialogContent.innerHTML = str;
			beCenter( this.dialogBox );
		}
	}
	/**************** Dialog类  E ****************/
	window.Dialog = Dialog;
})();