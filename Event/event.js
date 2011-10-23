/**
 * 提供跨浏览器的事件处理机制
 * @module event
 * @submodule base.library
 * @author l.w.kampfer@gmail.com
 */

(function( kampfer ) {
	var eventID = 0;
	
	function Event( event ) {
		this.oEvent = event;
	}
	(function( p ){
		p.preventDefault = function(returnValue) {
			var e = this.oEvent;
			e.preventDefault();
			e.returnValue = returnValue || false;
		};
	})( Event.prototype );
	
	function addEvent( el, type, fn ) {
		if( arguments.length < 3 || typeof el !== 'object' || 
			typeof type !== 'string' || typeof fn !== 'function' ) {
			return false;
		}
		if( el.addEventListener ) {
			el.addEventListener( type, fn, false );
		} else {
			if( !el.$eventsList ) {
				el.$eventsList = {};
			}
			if( !el.$eventsList[type] ) {
				el.$eventsList[type] = [];
			}
			if( el['on' + type] ) {
				el.$eventsList[type][0] = el['on' + type];
			}
			if( !fn.$ID ) {
				fn.$ID = eventID++;
			}
			el.$eventsList[type][fn.$ID] = fn;
			el['on' + type] = handler;
		}
	}
	
	function removeEvent( el, type, fn ) {
		if( arguments.length < 3 || typeof el !== 'object' || 
			typeof type !== 'string' || typeof fn !== 'function' ) {
			return false;
		}
		if( el.removeEventListener ) {
			el.removeEventListener( type, fn, false );
		} else {
			if( el.$eventsList && el.$eventsList[type] && fn.$ID ) {
				delete el.$eventsList[type][fn.$ID];
			}
		}
	}
	
	function handler( event ) {
		event = new Event( event );
		var eventsList = this.$eventsList[event.type];
		for( var i = 0, l = eventsList.length; i < l; i++ ) {
			if( eventsList[i] ) {
				eventsList[i]( event );
			}
		}
	}
	
	kampfer.extend( kampfer, {
		addEvent : addEvent,
		removeEvent : removeEvent
	});
	
})( kampfer );
