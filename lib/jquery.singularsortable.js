(function($) {
	$.widget("ui.singular_sortable", {
		_init : function() {
			this.options.me = this;
			this.element.bind('sortupdate', this._onSortUpdate);
		},
		
		moveToTop : function(sortableItem) {
		  // Update the position data
		  this._reorderPositions(sortableItem, 1);
		  
		  // Move it in the DOM
		  $(sortableItem).remove();
		  $(this.element).prepend(sortableItem);
		},
		
		_onSortUpdate : function(e, ui) {
      var me = $(this).data('singular_sortable').options.me;
			var newPosition = me._reorderPositions(ui.item, undefined, ui.sender);
			me._trigger("update", e, $.extend(ui, {'numericalPosition' : newPosition}));
		},
		
		_reorderPositions : function(sortableItem, newPosition, sender) {
      // Where are we now?
      var oldPosition = this._findListingPosition(sortableItem);
    
      // Prune us out of the list, shifting everyone up to close the newly open slot
      this._setListingPosition(sortableItem, -9999, sender);
      this._shiftLowerUp(oldPosition, sender);
    
      // If no position was passed, then we find our new spot based on surrounding elements, but don't insert yet...
      if(typeof newPosition == 'undefined') {
        newPosition = this._findNewListingPosition(sortableItem);
      }
    
      // Shift everyone below us down by one in order to open the slot
      this._shiftLowerDown(newPosition);
    
      // Insert at our new slot
      this._setListingPosition(sortableItem, newPosition);
    
      return newPosition;
    },
  
    // Calculates the new position value for a sortableItem, based on the position
    // values of the surrounding elements.
    _findNewListingPosition : function(sortableItem) {
      var position = null;
      var next = sortableItem.next();
    
      // It assumes the position of the element right beneath it in the list
      if(next && (next.attr(this.options.positionAttribute) != undefined)) {
        position = this._findListingPosition(next)
      } else {
        // Or, if nothing beneath it, then it assumes (position + 1) of the item right above it
        var prev = sortableItem.prev();
        if(prev && (prev.attr(this.options.positionAttribute) != undefined)) {
          position = this._findListingPosition(prev) + 1;
        } else {
          position = 1;
        }
      }
    
      return position;
    },
  
    _shiftLowerUp : function(position, sender) {
      this._shiftLowerBy(position, -1, sender);
    },
  
    _shiftLowerDown : function(position, sender) {
      this._shiftLowerBy(position, 1, sender);
    },
  
    _shiftLowerBy : function(position, byAmount, sender) {
      var me = this;
      var element;
      if (sender) {
        element = sender;
      } else {
        element = this.element;
      }
      jQuery('[' + this.options.positionAttribute + ']', element).each(function(i) {
        var item = jQuery(this);
        var itemPos = me._findListingPosition(item);
        if(itemPos >= position) {
          me._setListingPosition(item, itemPos + byAmount);
        }
      });
    },
  
    _findListingPosition : function(sortableItem) {
      return parseInt(sortableItem.attr(this.options.positionAttribute));
    },
  
    _setListingPosition : function(sortableItem, newPosition) {
      sortableItem.attr(this.options.positionAttribute, newPosition);
    }
		
	});
	
	$.extend($.ui.singular_sortable, {
		defaults : {
			positionAttribute : 'data-position'
		}
	});
})(jQuery);
