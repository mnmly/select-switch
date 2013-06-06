
/**
 * Module dependencies.
 */

var find = require('select')
  , events = require('events');

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

function SelectSwitch(selectbox, height){
  
  if(!(this instanceof SelectSwitch)) return new SelectSwitch(selectbox);
  
  this.height = height || 21;

  this.el = this._createElement('div', 'select-switch');
  this.optionList = this._createElement('ul', 'option-list');
  this.selectbox = selectbox;
  this.optionCount = this.selectbox.options.length;
  
  this.indexCount  = 0;
  this.el.style.height = this.height + 'px';

  this.listWrap = this._createElement('div', 'list-wrap');
  this.listWrap.appendChild(this.optionList);
  this.el.appendChild(this.listWrap);
  this.selectbox.parentElement.appendChild(this.el);

  this.renderItems();
  this.selectbox.style.display = 'none';
  
  this.presetValue();
  this.bind();
}


/**
 * Render initial option item list
 */

SelectSwitch.prototype.renderItems = function() {
  
  for ( var i = 0; i < this.selectbox.options.length; i += 1 ) {
    var option = this.selectbox.options[i]
      , li = document.createElement('li');
    li.textContent = option.textContent;
    this.addItem(li);
  }

};

/**
 * Add list item
 */

SelectSwitch.prototype.addItem = function(item) {
  item.style.lineHeight = this.height + 'px';
  this.optionList.appendChild(item);
}


/**
 * Bind events
 */

SelectSwitch.prototype.bind = function() {
  this.events = events(this.el, this);
  this.events.bind(('ontouchstart' in window) ? 'touchstart' : 'click');
}

/**
 * Preset the value by getting `selected` state from `selectbox` options
 */

SelectSwitch.prototype.presetValue = function() {
  var _selectedIndex = this.selectbox.selectedIndex + 1;
  while(_selectedIndex--){
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

  e && e.preventDefault();

  var count = this.indexCount++,
      shiftY = -this.height * count,
      _newItem = this.optionList.children[count].cloneNode(true);
  
  this.addItem(_newItem);

  var newValue = this.selectbox.options[count % this.optionCount].value;

  if ("fireEvent" in this.selectbox){
    this.selectbox.fireEvent("onchange");
  } else {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    this.selectbox.dispatchEvent(evt);
  }
  this.shift(shiftY);
}

/**
 * Shift labels by `shiftY`
 */

SelectSwitch.prototype.shift = function(shiftY) {

  this.optionList.style.webkitTransform = 
     this.optionList.style.mozTransform = 
        this.optionList.style.transform = 'translate3d(0, ' + shiftY + 'px, 0)';
};

/**
 * Setter and getter for value
 */

SelectSwitch.prototype.value = function(value) {

  if (typeof value !== 'undefined'){

    var _index = -1
      , option = find(this.selectbox.options, function(item, i) {
        var condition = value === item.value;
        if (condition) _index = i;
        return condition
      })
      , _currentIndex = this.selectbox.selectedIndex;

    if( _index === -1 ){ return; }

    _index -= _currentIndex;
    if (_index < 0){
      _index += this.optionCount;
    }
    while( _index-- ){
      this.onclick();
    }
  } else {
    return this.selectbox.selectedOptions[0];
  }
}

/**
 * Create element helper
 */

SelectSwitch.prototype._createElement = function(tagName, className) {
  var el = document.createElement(tagName);
  el.className = className;
  return el;
};

