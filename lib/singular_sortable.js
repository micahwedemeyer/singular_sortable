var singular_sortable = {};

(function() {
  // Handly little shortcut...
  var me = singular_sortable;
  
  jQuery.extend(singular_sortable, {
    reorderPositions : function(sortableItem, theSortable, positionAttr) {
      
      // FIXME - Is this a bad way to set 'instance' variables? I'm so terrible at OO-javascript
      me.theSortable = theSortable;
      if(typeof(positionAttr) == undefined) {
        positionAttr = 'data-position';
      }
      me.positionAttr = positionAttr;
      
      // Make sure we're dealing w/ a jQuery object
      var sortableItem = jQuery(sortableItem);
    
      // Where are we now?
      var oldPosition = me.findListingPosition(sortableItem);
    
      // Prune us out of the list, shifting everyone up to close the newly open slot
      me.setListingPosition(sortableItem, -9999);
      me.shiftLowerUp(oldPosition);
    
      // Find our new spot in the list, but don't insert yet...
      var newPosition = me.findNewListingPosition(sortableItem);
    
      // Shift everyone below us down by one in order to open the slot
      me.shiftLowerDown(newPosition);
    
      // Insert at our new slot
      me.setListingPosition(sortableItem, newPosition);
    
      return newPosition;
    },
  
    // Calculates the new position value for a sortableItem, based on the position
    // values of the surrounding elements.
    findNewListingPosition : function(sortableItem) {
      var position = null;
      var next = sortableItem.next();
    
      // It assumes the position of the element right beneath it in the list
      if(next && (next.attr(me.positionAttr) != undefined)) {
        position = me.findListingPosition(next)
      } else {
        // Or, if nothing beneath it, then it assumes (position + 1) of the item right above it
        var prev = sortableItem.prev();
        if(prev && (prev.attr(me.positionAttr) != undefined)) {
          position = me.findListingPosition(prev) + 1;
        }
      }
    
      return position;
    },
  
    shiftLowerUp : function(position) {
      me.shiftLowerBy(position, -1);
    },
  
    shiftLowerDown : function(position) {
      me.shiftLowerBy(position, 1);
    },
  
    shiftLowerBy : function(position, byAmount) {
      jQuery('[' + me.positionAttr + ']', me.theSortable).each(function(i) {
        var item = jQuery(this);
        var itemPos = me.findListingPosition(item);
        if(itemPos >= position) {
          me.setListingPosition(item, itemPos + byAmount);
        }
      });
    },
  
    findListingPosition : function(sortableItem) {
      return parseInt(sortableItem.attr(me.positionAttr));
    },
  
    setListingPosition : function(sortableItem, newPosition) {
      sortableItem.attr(me.positionAttr, newPosition);
    }
  });
})();