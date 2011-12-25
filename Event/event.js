/**
 * 提供跨浏览器的事件处理机制
 * @module event
 * @submodule base.library
 * @author l.w.kampfer@gmail.com
 */

(function( kampfer ) {
	
	var eventID = 1;
	
	function Event( event ) {
		this.oEvent = event;
		this.type = event.type;
		this.target = event.target || event.srcElement;
	}
	
	var p = Event.prototype;
		
	//阻止默认事件
	p.preventDefault = function( returnValue ) {
		var e = this.oEvent;
		e.returnValue = false;
	};
	
	//阻止事件传播
	p.stopPropagation = function() {
		var e = this.oEvent;
		//ie
		if( typeof e.cancelBubble !== 'undefined' ) {
			e.cancelBubble = true;
		//chrome firefox ...
		} else {
			e.stopPropagation();
		}
	};
		
	function handler( event ) {
		event = event || window.event;
		event = new Event( event );
		var eventsList = this.$eventsList[event.type];
		for( var i = 0, l = eventsList.length; i < l; i++ ) {
			if( eventsList[i] ) {
				eventsList[i].call( this, event );
			}
		}
	}
	
	function addEvent( el, type, fn ) {
	}
	
	function removeEvent( el, type, fn ) {
	}
	
	function trigger() {
	}
	
	kampfer.extend( kampfer, {
		addEvent : addEvent,
		removeEvent : removeEvent
	});
	
})( kampfer );
