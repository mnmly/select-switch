
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-select/index.js", function(exports, require, module){

/**
 * Filter the given `arr` with callback `fn(val, i)`,
 * when a truthy value is return then `val` is included
 * in the array returned.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

module.exports = function(arr, fn){
  var ret = [];
  for (var i = 0; i < arr.length; ++i) {
    if (fn(arr[i], i)) {
      ret.push(arr[i]);
    }
  }
  return ret;
};
});
require.register("component-event/index.js", function(exports, require, module){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("component-event-manager/index.js", function(exports, require, module){


/**
 * Expose `EventManager`.
 */

module.exports = EventManager;

/**
 * Initialize an `EventManager` with the given
 * `target` object which events will be bound to,
 * and the `obj` which will receive method calls.
 *
 * @param {Object} target
 * @param {Object} obj
 * @api public
 */

function EventManager(target, obj) {
  this.target = target;
  this.obj = obj;
  this._bindings = {};
}

/**
 * Register bind function.
 *
 * @param {Function} fn
 * @return {EventManager} self
 * @api public
 */

EventManager.prototype.onbind = function(fn){
  this._bind = fn;
  return this;
};

/**
 * Register unbind function.
 *
 * @param {Function} fn
 * @return {EventManager} self
 * @api public
 */

EventManager.prototype.onunbind = function(fn){
  this._unbind = fn;
  return this;
};

/**
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 *    events.bind('login') // implies "onlogin"
 *    events.bind('login', 'onLogin')
 *
 * @param {String} event
 * @param {String} [method]
 * @return {EventManager}
 * @api public
 */

EventManager.prototype.bind = function(event, method){
  var obj = this.obj;
  var method = method || 'on' + event;
  var args = [].slice.call(arguments, 2);

  // callback
  function callback() {
    var a = [].slice.call(arguments).concat(args);
    obj[method].apply(obj, a);
  }

  // subscription
  this._bindings[event] = this._bindings[event] || {};
  this._bindings[event][method] = callback;

  // bind
  this._bind(event, callback);

  return this;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 *     evennts.unbind('login', 'onLogin')
 *     evennts.unbind('login')
 *     evennts.unbind()
 *
 * @param {String} [event]
 * @param {String} [method]
 * @api public
 */

EventManager.prototype.unbind = function(event, method){
  if (0 == arguments.length) return this.unbindAll();
  if (1 == arguments.length) return this.unbindAllOf(event);
  var fn = this._bindings[event][method];
  this._unbind(event, fn);
};

/**
 * Unbind all events.
 *
 * @api private
 */

EventManager.prototype.unbindAll = function(){
  for (var event in this._bindings) {
    this.unbindAllOf(event);
  }
};

/**
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

EventManager.prototype.unbindAllOf = function(event){
  var bindings = this._bindings[event];
  if (!bindings) return;
  for (var method in bindings) {
    this.unbind(event, method);
  }
};

});
require.register("component-events/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Manager = require('event-manager')
  , event = require('event');

/**
 * Return a new event manager.
 */

module.exports = function(target, obj){
  var manager = new Manager(target, obj);

  manager.onbind(function(name, fn){
    event.bind(target, name, fn);
  });

  manager.onunbind(function(name, fn){
    event.unbind(target, name, fn);
  });

  return manager;
};

});
require.register("select-switch/index.js", function(exports, require, module){

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


});
require.alias("component-select/index.js", "select-switch/deps/select/index.js");
require.alias("component-select/index.js", "select/index.js");

require.alias("component-events/index.js", "select-switch/deps/events/index.js");
require.alias("component-events/index.js", "events/index.js");
require.alias("component-event/index.js", "component-events/deps/event/index.js");

require.alias("component-event-manager/index.js", "component-events/deps/event-manager/index.js");

