/*
 * Dialog
 * version 1.1
 * AUTHOR l.w.kampfer@gmail.com
 */
(function( window ) {
	//默认设置
	var defaultOptions = {
		title : '',
		width : 300,
		height : 'auto',
		modal :　'normal',
		dialogClass : '',
		zIndex : 1000
	};
	function _beCenter( element ) {
		var wWidth = k.getWidth( window ),
			wHeight = k.getHeight( window ),
			eWidth = k.getWidth( element ),
			eHeight = k.getHeight( element ),
			sLeft = k.getScrollLeft( window ),
			sTop = k.getScrollTop( window ),
			left,top;
		left = sLeft + ( wWidth - eWidth )/2;
		top = sTop + ( wHeight - eHeight )/2;
		element.style.position = 'absolute';
		element.style.left = left + 'px';
		element.style.top = top + 'px';
	}
	function _createDialog( originElement ) {
		//创建dom组建
		var dialog = document.createElement( 'div' ),
			dialogTitleBar = document.createElement( 'div' ),
			dialogContent = document.body.removeChild( originElement ).cloneNode( true ),
			dialogCloseButton = document.createElement( 'a' ),
			dialogTitle = document.createElement( 'span' );
		//关闭按钮
		dialog._closeButton = dialogCloseButton;
		k.addClass( dialogCloseButton, 'dialog-close' ); 
		dialogTitleBar.appendChild( dialogCloseButton );
		//文字标题
		dialog._title = dialogTitle;
		k.addClass( dialogTitle, 'dialog-title' );
		dialogTitleBar.appendChild( dialogTitle );
		//标题容器
		dialog._titleBar = dialogTitleBar;
		k.addClass( dialogTitleBar, 'dialog-title-bar' );
		dialog.appendChild( dialogTitleBar );
		//正文容器
		dialog._content = dialogContent;
		k.addClass( dialogContent, 'dialog-content' );
		dialog.appendChild( dialogContent );
		//dialog容器
		k.addClass( dialog, 'dialog' );
		//
		return dialog;
	}
	function _initDialog( dialogDom, options, dialog ) {
		dialogDom.style.width = options.width + 'px';
		dialogDom.style.height = options.height === 'auto' ? options.height : options.height + 'px';
		dialogDom.style.zIndex = options.zIndex;
		if( options.title ) {
			dialogDom._title.appendChild( document.createTextNode( options.title ) );
		}
		//使用了闭包
		k.addEvent( dialogDom._closeButton, 'click', function(){
			dialog.close();
		});
	}
	function Dialog( obj ) {
		this.originElement = obj;
		if( arguments[1] ) {
			this.init( arguments[1] );
		}
	}
	Dialog.prototype = {
		init : function(options) {
			if( this.dialogDom ) {
				return false;
			}
			if( k.isObject( options ) ) {
				this.options = k.extend( {}, defaultOptions, options );
			}
			var dialogDom = _createDialog( this.originElement );
			_initDialog( dialogDom, this.options, this );
			this.dialogDom = dialogDom;
			document.body.appendChild( dialogDom );
		},
		open : function() {
			_beCenter( this.dialogDom );
			this.dialogDom.style.display = 'block';
		},
		close : function() {
			this.dialogDom.style.display = 'none';
		}
		/*
		setContent : function( str ) {
			this.dialogContent.innerHTML = str;
			_beCenter( this.dialogBox );
		}
		*/
	};
	/**************** Dialog类  E ****************/
	if( window.Dialog === undefined ) {
		window.Dialog = Dialog;
	} else {
		alert( 'Dialg has been defined !' );
	}
})( window );