
/**
 * Module dependencies.
 */

var o = require( 'jquery' ),
    events = require( 'events' );

/**
 * Expose `SelectionSwitch`.
 */

module.exports = SelectSwitch;

/**
 * Initialize a new `SelectionSwitch`
 *
 * Create an `SelectionSwitch` against `selectbox`.
 * `height` is optional, but should be required...
 *
 */

function SelectSwitch( selectbox, height ){
  
  if( !( this instanceof SelectSwitch ) ) return new SelectSwitch( selectbox );
  
  this.height      = height || 21;

  this.el          = o( '<div class="select-switch"/>' );
  this.optionList  = o( '<ul class="option-list"/>' );
  this.selectbox   = o( selectbox );
  this.optionCount = this.selectbox.find( 'option' ).length;
  this.indexCount  = 0;
  
  this.el.css( 'height', this.height );
  this.el.append( '<div class="list-wrap"/>' );
  this.el.find( '.list-wrap' ).append( this.optionList );
  this.el.insertAfter( this.selectbox );

  this.renderItems();
  this.selectbox.hide();
  
  this.presetValue();
  this.bind();
}


/**
 * Render initial option item list
 */

SelectSwitch.prototype.renderItems = function() {
  
  var _this     = this,
      _itemHTML = '';

  this.selectbox.find( 'option' ).each( function( i, el ){
    _this.addItem( '<li>' + o( el ).text() + '</li>' );
  } );
};

/**
 * Add list item
 */

SelectSwitch.prototype.addItem = function( item ) {
  this.optionList.append( item );
  this.optionList.find('li:last-child').css('line-height', this.height + 'px');
}


/**
 * Bind events
 */

SelectSwitch.prototype.bind = function() {
  this.events = events(this.el.get(0), this);
  this.events.bind( ( 'ontouchstart' in window ) ? 'touchstart' : 'click' );
}

/**
 * Preset the value by getting `selected` state from `selectbox` options
 */

SelectSwitch.prototype.presetValue = function() {
  var _selectedIndex = this.selectbox.find( ':selected' ).index() + 1;
  while( _selectedIndex-- ){
    this.onclick();
  }
}


/**
 * onclick event
 *
 * Change the selectbox value, and shift labels.
 */

SelectSwitch.prototype.ontouchstart = function( e ) {
    this.onclick(e);
}

SelectSwitch.prototype.onclick = function( e ) {
  if( e ){ e.preventDefault(); }
  var _this    = this,
      count    = this.indexCount++,
      shiftY   = -this.height * count;
      _newItem = this.optionList.find('li').eq( count ).clone();
  
  this.addItem( _newItem );
  this.selectbox.find( 'option' ).eq( count % this.optionCount ).prop( 'selected', true );
  this.shift( shiftY );
}

/**
 * Shift labels by `shiftY`
 */

SelectSwitch.prototype.shift = function( shiftY ) {
  this.optionList.css( {
    '-webkit-transform': 'translate3d( 0, ' + shiftY + 'px, 0 )',
       '-moz-transform': 'translate3d( 0, ' + shiftY + 'px, 0 )',
            'transform': 'translate3d( 0, ' + shiftY + 'px, 0 )'
  } );
};

/**
 * Setter and getter for value
 */

SelectSwitch.prototype.value = function( value ) {

  if ( typeof value !== 'undefined' ){

    var _index        = this.selectbox.find( '[value="' + value + '"]' ).index(),
        _currentIndex = this.selectbox.find( ':selected' ).index();

    if( _index === -1 ){ return; }

    _index -= _currentIndex;
    if ( _index < 0 ){
      _index += this.optionCount;
    }
    while( _index-- ){
      this.onclick();
    }
  } else {
    return this.selectbox.find( 'option:selected' ).val();
  }
}
