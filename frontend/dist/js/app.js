/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var a;
	
	a = __webpack_require__(153);
	
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW5kaS9kZXYvc2NoaWNodC9mcm9udGVuZC9hcHAvc3JjL2NsaWVudC5janN4Iiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYW5kaS9kZXYvc2NoaWNodC9mcm9udGVuZC9hcHAvc3JjL2NsaWVudC5janN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWdCQSxJQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEscUJBQVIiLCJzb3VyY2VzQ29udGVudCI6WyIjIFJlYWN0RE9NID0gcmVxdWlyZSAncmVhY3QtZG9tJ1xuIyBpbmplY3RUYXBFdmVudFBsdWdpbiA9IHJlcXVpcmUgJ3JlYWN0LXRhcC1ldmVudC1wbHVnaW4nXG4jXG4jIEFQSSA9IHJlcXVpcmUgJ2FwaSdcbiMgUm91dGVyID0gcmVxdWlyZSAnLi9Sb3V0ZXInXG4jXG4jICMgTmVlZGVkIGZvciBvblRvdWNoVGFwXG4jICMgQ2FuIGdvIGF3YXkgd2hlbiByZWFjdCAxLjAgcmVsZWFzZVxuIyBpbmplY3RUYXBFdmVudFBsdWdpbigpXG4jXG4jXG4jXG4jICQgLT5cbiMgICBBUEkuY29ubmVjdCgpXG4jICAgUmVhY3RET00ucmVuZGVyKFJvdXRlciwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpKVxuXG5hID0gcmVxdWlyZSAnbGlxdWlkRmx1eC9mcm9udGVuZCdcbiJdfQ==


/***/ },

/***/ 153:
/***/ function(module, exports, __webpack_require__) {

	var realPackage;
	
	realPackage = __webpack_require__(154);
	
	module.exports = realPackage;


/***/ },

/***/ 154:
/***/ function(module, exports, __webpack_require__) {

	var API, Dispatcher, constantsGenerator, createActions, createQueries, createStore, liquidFlux, mixin;
	
	Dispatcher = __webpack_require__(155);
	
	mixin = __webpack_require__(158);
	
	API = __webpack_require__(159);
	
	createStore = __webpack_require__(161);
	
	createQueries = __webpack_require__(164);
	
	createActions = __webpack_require__(165);
	
	constantsGenerator = __webpack_require__(266);
	
	liquidFlux = {
	  Dispatcher: Dispatcher,
	  mixin: mixin,
	  API: API,
	  createActions: createActions,
	  createQueries: createQueries,
	  createStore: createStore,
	  constants: constantsGenerator
	};
	
	module.exports = liquidFlux;


/***/ },

/***/ 155:
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, Logger;
	
	Logger = __webpack_require__(156)('Dispatcher');
	
	module.exports = Dispatcher = {
	  callbacks: {},
	  register: function(action, callback) {
	    if (action === void 0) {
	      Logger.error("undefined action, maybe forgot to define constant?");
	    }
	    Logger.log("register " + action);
	    if (Dispatcher.callbacks[action]) {
	      return Dispatcher.callbacks[action].push(callback);
	    } else {
	      return Dispatcher.callbacks[action] = [callback];
	    }
	  },
	  dispatch: function(action, payload) {
	    var cb, i, len, promises, ref;
	    if (action === void 0) {
	      Logger.error("undefined action, maybe forgot to define constant?");
	    }
	    Logger.log("dispatch " + action, payload);
	    if (!Dispatcher.callbacks[action]) {
	      return new Promise(function(fulfill) {
	        return fulfill();
	      });
	    }
	    promises = [];
	    ref = Dispatcher.callbacks[action];
	    for (i = 0, len = ref.length; i < len; i++) {
	      cb = ref[i];
	      promises.push(cb(payload));
	    }
	    return Promise.all(promises);
	  }
	};


/***/ },

/***/ 156:
/***/ function(module, exports, __webpack_require__) {

	var moment,
	  slice = [].slice;
	
	moment = __webpack_require__(157);
	
	module.exports = function(prefix) {
	  return {
	    time: function() {
	      return '[' + moment().format('HH:mm:ss') + ']';
	    },
	    log: function() {
	      var args;
	      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	      args[0] = this.time() + ("[" + prefix + "] " + args[0]);
	      return console.log.apply(console, args);
	    },
	    error: function() {
	      var args;
	      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	      args[0] = this.time() + ("[" + prefix + "] " + args[0]);
	      return console.error.apply(console, args);
	    }
	  };
	};


/***/ },

/***/ 157:
/***/ function(module, exports) {

	module.exports = moment;

/***/ },

/***/ 158:
/***/ function(module, exports) {

	module.exports = {
	  componentDidMount: function() {
	    var i, len, listener, ref, results;
	    if (!this.setStoreListener) {
	      return;
	    }
	    ref = this.setStoreListener();
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      listener = ref[i];
	      if (!listener[1]) {
	        listener[1] = this.refreshFluxStates;
	      }
	      if (!listener[2]) {
	        listener[2] = 'CHANGE';
	      }
	      results.push(listener[0].addListener(listener[2], listener[1]));
	    }
	    return results;
	  },
	  componentWillUnmount: function() {
	    var i, len, listener, ref, results;
	    if (!this.setStoreListener) {
	      return;
	    }
	    ref = this.setStoreListener();
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      listener = ref[i];
	      if (!listener[1]) {
	        listener[1] = this.refreshFluxStates;
	      }
	      if (!listener[2]) {
	        listener[2] = 'CHANGE';
	      }
	      results.push(listener[0].removeListener(listener[2], listener[1]));
	    }
	    return results;
	  },
	  componentWillReceiveProps: function(nextProps) {
	    return this.refreshFluxStates(null, nextProps);
	  },
	  getInitialState: function() {
	    if (this.getFluxStates) {
	      return this.getFluxStates(this.props);
	    }
	  },
	  refreshFluxStates: function(p, props) {
	    props = props ? props : this.props;
	    if (this.getFluxStates) {
	      return this.setState(this.getFluxStates(props));
	    }
	  }
	};


/***/ },

/***/ 159:
/***/ function(module, exports, __webpack_require__) {

	var API, Logger, bodyHelpers, generateRandomString;
	
	Logger = __webpack_require__(156)('API');
	
	bodyHelpers = __webpack_require__(160);
	
	generateRandomString = function(strong) {
	  var buf, i, j, k, len, number, res;
	  if (strong == null) {
	    strong = false;
	  }
	  if (strong) {
	    res = '';
	    buf = new Uint8Array(16);
	    window.crypto.getRandomValues(buf);
	    for (j = 0, len = buf.length; j < len; j++) {
	      number = buf[j];
	      res += number.toString(16);
	    }
	    return res;
	  } else {
	    res = '';
	    for (i = k = 0; k < 16; i = ++k) {
	      res += Math.round(Math.random() * 15).toString(16);
	    }
	    return res;
	  }
	};
	
	API = (function() {
	  API.prototype.sessionId = null;
	
	  API.prototype.socket = null;
	
	  API.prototype._updateHandlers = {};
	
	  API.prototype._packets = {};
	
	  function API(url) {
	    this.socket = io(url);
	    this.socket.on('connect', (function(_this) {
	      return function() {
	        if (!_this.sessionId) {
	          _this.sessionId = generateRandomString(true);
	        }
	        Logger.log("sessionId: " + _this.sessionId);
	        _this.socket.emit('session', _this.sessionId);
	        _this.socket.on('response', _this.handleResponse.bind(_this));
	        return _this.socket.on('update', _this.handleUpdate.bind(_this));
	      };
	    })(this));
	  }
	
	  API.prototype.handleResponse = function(id, header, body) {
	    var packet;
	    packet = this._packets[id];
	    if (packet) {
	      if (header.error) {
	        return packet.reject(bodyHelpers.parse(body));
	      } else {
	        return packet.fulfill(bodyHelpers.parse(body));
	      }
	    }
	  };
	
	  API.prototype.handleUpdate = function(id, header, body) {
	    var cb, handler, j, len, results;
	    handler = this._updateHandlers[header.type + '__' + header.path];
	    if (!handler) {
	      return;
	    }
	    results = [];
	    for (j = 0, len = handler.length; j < len; j++) {
	      cb = handler[j];
	      results.push(cb(bodyHelpers.parse(body)));
	    }
	    return results;
	  };
	
	  API.prototype.get = function(path, onUpdate) {
	    return this.send('GET', path, null, onUpdate);
	  };
	
	  API.prototype.post = function(path, body, onUpdate) {
	    return this.send('POST', path, body, onUpdate);
	  };
	
	  API.prototype.update = function(path, body, onUpdate) {
	    return this.send('UPDATE', path, body, onUpdate);
	  };
	
	  API.prototype.send = function(type, path, body, onUpdate) {
	    return new Promise((function(_this) {
	      return function(fulfill, reject) {
	        var id;
	        Logger.log(type + " " + path);
	        id = generateRandomString();
	        if (onUpdate) {
	          if (!_this._updateHandlers[type + '__' + path]) {
	            _this._updateHandlers[type + '__' + path] = [];
	          }
	          _this._updateHandlers[type + '__' + path].push(onUpdate);
	        }
	        _this._packets[id] = {
	          fulfill: fulfill,
	          reject: reject
	        };
	        if (body) {
	          return _this.socket.emit('request', id, {
	            type: type,
	            path: path
	          }, bodyHelpers.compose(body));
	        } else {
	          return _this.socket.emit('request', id, {
	            type: type,
	            path: path
	          });
	        }
	      };
	    })(this));
	  };
	
	  return API;
	
	})();
	
	module.exports = API;


/***/ },

/***/ 160:
/***/ function(module, exports) {

	module.exports = {
	  parse: function(body) {
	    if (typeof body !== 'string') {
	      return;
	    }
	    return JSON.parse(body);
	  },
	  compose: function(body) {
	    if (typeof body !== 'object') {
	      return;
	    }
	    return JSON.stringify(body);
	  }
	};


/***/ },

/***/ 161:
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, EventEmitter, Logger, LoggerStore, assign;
	
	assign = __webpack_require__(162);
	
	EventEmitter = __webpack_require__(163).EventEmitter;
	
	Logger = __webpack_require__(156)('createStore');
	
	LoggerStore = __webpack_require__(156)('Store');
	
	Dispatcher = __webpack_require__(155);
	
	module.exports = function(obj) {
	  var Store, func, i, key, keyWord, keyWords, len, ref;
	  Store = assign({
	    getInitialState: function() {
	      return {};
	    }
	  }, EventEmitter.prototype, obj);
	  Store.bindAction = function(action, callback) {
	    if (action === void 0) {
	      return Logger.error("action is undefined, maybe forgot to set constant?");
	    } else {
	      if (typeof callback === 'function') {
	        return Dispatcher.register(action, callback.bind(Store));
	      } else {
	        return Logger.error("callback for " + action + " is no function");
	      }
	    }
	  };
	  Store.fetch = function(options) {
	    var value;
	    value = options.locally.bind(Store)();
	    if (value === void 0) {
	      options.remotely.bind(Store)();
	      return options["default"];
	    } else {
	      return value;
	    }
	  };
	  Store.emitChange = function(key) {
	    if (key == null) {
	      key = 'CHANGE';
	    }
	    LoggerStore.log(Store.pod + " -> " + key);
	    return Store.emit(key);
	  };
	  keyWords = ['get', 'update', 'set', 'do'];
	  for (i = 0, len = keyWords.length; i < len; i++) {
	    keyWord = keyWords[i];
	    if (Store[keyWord]) {
	      ref = Store[keyWord];
	      for (key in ref) {
	        func = ref[key];
	        Store[keyWord + key[0].toUpperCase() + key.substr(1)] = func.bind(Store);
	      }
	    }
	  }
	  Store.initialise();
	  Store.state = Store.getInitialState();
	  return Store;
	};


/***/ },

/***/ 162:
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },

/***/ 163:
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, EventEmitter, Logger, _callQuery, assign, runningManager,
	  slice = [].slice;
	
	assign = __webpack_require__(162);
	
	EventEmitter = __webpack_require__(163).EventEmitter;
	
	Logger = __webpack_require__(156)('createQueries');
	
	Dispatcher = __webpack_require__(155);
	
	runningManager = document.runningManager = {
	  queries: {},
	  isRunning: function(pod, name, args) {
	    var instance, j, key, len, ref;
	    key = pod + "::" + name;
	    if (!this.queries[key]) {
	      return false;
	    }
	    ref = this.queries[key];
	    for (j = 0, len = ref.length; j < len; j++) {
	      instance = ref[j];
	      if (this.compareArgs(instance, args)) {
	        return true;
	      }
	    }
	    return false;
	  },
	  compareArgs: function(a, b) {
	    var aString, bString;
	    if (a.length !== b.length) {
	      return false;
	    }
	    aString = JSON.stringify(a);
	    bString = JSON.stringify(b);
	    return aString.localeCompare(bString) === 0;
	  },
	  runs: function(pod, name, args) {
	    var key;
	    key = pod + "::" + name;
	    if (this.queries[key]) {
	      return this.queries[key].push(args);
	    } else {
	      return this.queries[key] = [args];
	    }
	  },
	  stopped: function(pod, name, args) {
	    var i, instance, j, key, len, ref;
	    key = pod + "::" + name;
	    if (!this.queries[key] || this.queries[key].length <= 1) {
	      return delete this.queries[key];
	    } else {
	      ref = this.queries[key];
	      for (i = j = 0, len = ref.length; j < len; i = ++j) {
	        instance = ref[i];
	        if (this.compareArgs(instance, args)) {
	          this.queries[key].splice(i, 1);
	          return;
	        }
	      }
	    }
	  }
	};
	
	_callQuery = function(query, name, pod) {
	  return function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    if (runningManager.isRunning(pod, name, args)) {
	      return;
	    }
	    Logger.log("call " + pod + "::" + name + "(" + (args.join(', ')) + ")");
	    runningManager.runs(pod, name, args);
	    return query["do"].bind({
	      update: function() {
	        var response;
	        response = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	        Logger.log("got update " + pod + "::" + name + "(" + (args.join(', ')) + ")", response);
	        if (query.onUpdate) {
	          query.onUpdate.bind({
	            dispatch: Dispatcher.dispatch
	          }).apply(null, response);
	        }
	        return runningManager.stopped(pod, name, args);
	      },
	      success: function() {
	        var response;
	        response = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	        Logger.log("response " + pod + "::" + name + "(" + (args.join(', ')) + ")", response);
	        if (query.onSuccess) {
	          query.onSuccess.bind({
	            dispatch: Dispatcher.dispatch
	          }).apply(null, response);
	        }
	        return runningManager.stopped(pod, name, args);
	      },
	      error: function() {
	        var response;
	        response = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	        Logger.error("error while " + pod + "::" + name + "(" + (args.join(', ')) + ")", response);
	        runningManager.stopped(pod, name, args);
	        if (query.onError) {
	          return query.onError.bind({
	            dispatch: Dispatcher.dispatch
	          }).apply(null, response);
	        }
	      },
	      dispatch: Dispatcher.dispatch
	    }).apply(null, args);
	  };
	};
	
	module.exports = function(obj) {
	  var key, query, response;
	  response = {};
	  for (key in obj) {
	    query = obj[key];
	    if (key === 'pod') {
	      response.pod = obj.pod;
	    } else if (query["do"] === void 0) {
	      Logger.error(obj.pod + "::" + key + " needs an do() method");
	    } else {
	      response[key] = _callQuery(query, key, obj.pod);
	    }
	  }
	  return response;
	};


/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, Logger;
	
	Logger = __webpack_require__(156)('createActions');
	
	Dispatcher = __webpack_require__(155);
	
	module.exports = function(obj) {
	  var key, response, value;
	  response = {};
	  for (key in obj) {
	    value = obj[key];
	    if (typeof value !== 'function') {
	      Logger.error(key + " is no method");
	    } else {
	      response[key] = value.bind({
	        dispatch: Dispatcher.dispatch
	      });
	    }
	  }
	  return response;
	};


/***/ },

/***/ 266:
/***/ function(module, exports) {

	module.exports = function(prefix, keys) {
	  var i, k, len, response;
	  response = {};
	  for (i = 0, len = keys.length; i < len; i++) {
	    k = keys[i];
	    response[k] = prefix + '.' + k;
	  }
	  return response;
	};


/***/ }

/******/ });
//# sourceMappingURL=app.js.map