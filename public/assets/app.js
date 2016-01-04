webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(331);
	module.exports = __webpack_require__(402);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var API, ReactDOM, Router, injectTapEventPlugin;
	
	ReactDOM = __webpack_require__(170);
	
	injectTapEventPlugin = __webpack_require__(171);
	
	API = __webpack_require__(175);
	
	Router = __webpack_require__(190);
	
	injectTapEventPlugin();
	
	$(function() {
	  return ReactDOM.render(Router, document.getElementById('container'));
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "client.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(4);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var makePatchReactClass = __webpack_require__(5);
	
	/**
	 * Returns a function that, when invoked, patches a React class with a new
	 * version of itself. To patch different classes, pass different IDs.
	 */
	module.exports = function makeMakeHot(getRootInstances, React) {
	  if (typeof getRootInstances !== 'function') {
	    throw new Error('Expected getRootInstances to be a function.');
	  }
	
	  var patchers = {};
	
	  return function makeHot(NextClass, persistentId) {
	    persistentId = persistentId || NextClass.displayName || NextClass.name;
	
	    if (!persistentId) {
	      console.error(
	        'Hot reload is disabled for one of your types. To enable it, pass a ' +
	        'string uniquely identifying this class within this current module ' +
	        'as a second parameter to makeHot.'
	      );
	      return NextClass;
	    }
	
	    if (!patchers[persistentId]) {
	      patchers[persistentId] = makePatchReactClass(getRootInstances, React);
	    }
	
	    var patchReactClass = patchers[persistentId];
	    return patchReactClass(NextClass);
	  };
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var makeAssimilatePrototype = __webpack_require__(6),
	    requestForceUpdateAll = __webpack_require__(7);
	
	function hasNonStubTypeProperty(ReactClass) {
	  if (!ReactClass.hasOwnProperty('type')) {
	    return false;
	  }
	
	  var descriptor = Object.getOwnPropertyDescriptor(ReactClass, 'type');
	  if (typeof descriptor.get === 'function') {
	    return false;
	  }
	
	  return true;
	}
	
	function getPrototype(ReactClass) {
	  var prototype = ReactClass.prototype,
	      seemsLegit = prototype && typeof prototype.render === 'function';
	
	  if (!seemsLegit && hasNonStubTypeProperty(ReactClass)) {
	    prototype = ReactClass.type.prototype;
	  }
	
	  return prototype;
	}
	
	/**
	 * Returns a function that will patch React class with new versions of itself
	 * on subsequent invocations. Both legacy and ES6 style classes are supported.
	 */
	module.exports = function makePatchReactClass(getRootInstances, React) {
	  var assimilatePrototype = makeAssimilatePrototype(),
	      FirstClass = null;
	
	  return function patchReactClass(NextClass) {
	    var nextPrototype = getPrototype(NextClass);
	    assimilatePrototype(nextPrototype);
	
	    if (FirstClass) {
	      requestForceUpdateAll(getRootInstances, React);
	    }
	
	    return FirstClass || (FirstClass = NextClass);
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Returns a function that establishes the first prototype passed to it
	 * as the "source of truth" and patches its methods on subsequent invocations,
	 * also patching current and previous prototypes to forward calls to it.
	 */
	module.exports = function makeAssimilatePrototype() {
	  var storedPrototype,
	      knownPrototypes = [];
	
	  function wrapMethod(key) {
	    return function () {
	      if (storedPrototype[key]) {
	        return storedPrototype[key].apply(this, arguments);
	      }
	    };
	  }
	
	  function patchProperty(proto, key) {
	    proto[key] = storedPrototype[key];
	
	    if (typeof proto[key] !== 'function' ||
	      key === 'type' ||
	      key === 'constructor') {
	      return;
	    }
	
	    proto[key] = wrapMethod(key);
	
	    if (storedPrototype[key].isReactClassApproved) {
	      proto[key].isReactClassApproved = storedPrototype[key].isReactClassApproved;
	    }
	
	    if (proto.__reactAutoBindMap && proto.__reactAutoBindMap[key]) {
	      proto.__reactAutoBindMap[key] = proto[key];
	    }
	  }
	
	  function updateStoredPrototype(freshPrototype) {
	    storedPrototype = {};
	
	    Object.getOwnPropertyNames(freshPrototype).forEach(function (key) {
	      storedPrototype[key] = freshPrototype[key];
	    });
	  }
	
	  function reconcileWithStoredPrototypes(freshPrototype) {
	    knownPrototypes.push(freshPrototype);
	    knownPrototypes.forEach(function (proto) {
	      Object.getOwnPropertyNames(storedPrototype).forEach(function (key) {
	        patchProperty(proto, key);
	      });
	    });
	  }
	
	  return function assimilatePrototype(freshPrototype) {
	    if (Object.prototype.hasOwnProperty.call(freshPrototype, '__isAssimilatedByReactHotAPI')) {
	      return;
	    }
	
	    updateStoredPrototype(freshPrototype);
	    reconcileWithStoredPrototypes(freshPrototype);
	    freshPrototype.__isAssimilatedByReactHotAPI = true;
	  };
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var deepForceUpdate = __webpack_require__(8);
	
	var isRequestPending = false;
	
	module.exports = function requestForceUpdateAll(getRootInstances, React) {
	  if (isRequestPending) {
	    return;
	  }
	
	  /**
	   * Forces deep re-render of all mounted React components.
	   * Hats off to Omar Skalli (@Chetane) for suggesting this approach:
	   * https://gist.github.com/Chetane/9a230a9fdcdca21a4e29
	   */
	  function forceUpdateAll() {
	    isRequestPending = false;
	
	    var rootInstances = getRootInstances(),
	        rootInstance;
	
	    for (var key in rootInstances) {
	      if (rootInstances.hasOwnProperty(key)) {
	        rootInstance = rootInstances[key];
	
	        // `|| rootInstance` for React 0.12 and earlier
	        rootInstance = rootInstance._reactInternalInstance || rootInstance;
	        deepForceUpdate(rootInstance, React);
	      }
	    }
	  }
	
	  setTimeout(forceUpdateAll);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bindAutoBindMethods = __webpack_require__(9);
	var traverseRenderedChildren = __webpack_require__(10);
	
	function setPendingForceUpdate(internalInstance) {
	  if (internalInstance._pendingForceUpdate === false) {
	    internalInstance._pendingForceUpdate = true;
	  }
	}
	
	function forceUpdateIfPending(internalInstance, React) {
	  if (internalInstance._pendingForceUpdate === true) {
	    // `|| internalInstance` for React 0.12 and earlier
	    var instance = internalInstance._instance || internalInstance;
	
	    if (instance.forceUpdate) {
	      instance.forceUpdate();
	    } else if (React && React.Component) {
	      React.Component.prototype.forceUpdate.call(instance);
	    }
	  }
	}
	
	/**
	 * Updates a React component recursively, so even if children define funky
	 * `shouldComponentUpdate`, they are forced to re-render.
	 * Makes sure that any newly added methods are properly auto-bound.
	 */
	function deepForceUpdate(internalInstance, React) {
	  traverseRenderedChildren(internalInstance, bindAutoBindMethods);
	  traverseRenderedChildren(internalInstance, setPendingForceUpdate);
	  traverseRenderedChildren(internalInstance, forceUpdateIfPending, React);
	}
	
	module.exports = deepForceUpdate;


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	function bindAutoBindMethod(component, method) {
	  var boundMethod = method.bind(component);
	
	  boundMethod.__reactBoundContext = component;
	  boundMethod.__reactBoundMethod = method;
	  boundMethod.__reactBoundArguments = null;
	
	  var componentName = component.constructor.displayName,
	      _bind = boundMethod.bind;
	
	  boundMethod.bind = function (newThis) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    if (newThis !== component && newThis !== null) {
	      console.warn(
	        'bind(): React component methods may only be bound to the ' +
	        'component instance. See ' + componentName
	      );
	    } else if (!args.length) {
	      console.warn(
	        'bind(): You are binding a component method to the component. ' +
	        'React does this for you automatically in a high-performance ' +
	        'way, so you can safely remove this call. See ' + componentName
	      );
	      return boundMethod;
	    }
	
	    var reboundMethod = _bind.apply(boundMethod, arguments);
	    reboundMethod.__reactBoundContext = component;
	    reboundMethod.__reactBoundMethod = method;
	    reboundMethod.__reactBoundArguments = args;
	
	    return reboundMethod;
	  };
	
	  return boundMethod;
	}
	
	/**
	 * Performs auto-binding similar to how React does it.
	 * Skips already auto-bound methods.
	 * Based on https://github.com/facebook/react/blob/b264372e2b3ad0b0c0c0cc95a2f383e4a1325c3d/src/classic/class/ReactClass.js#L639-L705
	 */
	module.exports = function bindAutoBindMethods(internalInstance) {
	  var component = typeof internalInstance.getPublicInstance === 'function' ?
	    internalInstance.getPublicInstance() :
	    internalInstance;
	
	  if (!component) {
	    // React 0.14 stateless component has no instance
	    return;
	  }
	
	  for (var autoBindKey in component.__reactAutoBindMap) {
	    if (!component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
	      continue;
	    }
	
	    // Skip already bound methods
	    if (component.hasOwnProperty(autoBindKey) &&
	        component[autoBindKey].__reactBoundContext === component) {
	      continue;
	    }
	
	    var method = component.__reactAutoBindMap[autoBindKey];
	    component[autoBindKey] = bindAutoBindMethod(component, method);
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	function traverseRenderedChildren(internalInstance, callback, argument) {
	  callback(internalInstance, argument);
	
	  if (internalInstance._renderedComponent) {
	    traverseRenderedChildren(
	      internalInstance._renderedComponent,
	      callback,
	      argument
	    );
	  } else {
	    for (var key in internalInstance._renderedChildren) {
	      traverseRenderedChildren(
	        internalInstance._renderedChildren[key],
	        callback,
	        argument
	      );
	    }
	  }
	}
	
	module.exports = traverseRenderedChildren;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getRootInstancesFromReactMount = __webpack_require__(12);
	
	var injectedProvider = null,
	    didWarn = false;
	
	function warnOnce() {
	  if (!didWarn) {
	    console.warn(
	      'It appears that React Hot Loader isn\'t configured correctly. ' +
	      'If you\'re using NPM, make sure your dependencies don\'t drag duplicate React distributions into their node_modules and that require("react") corresponds to the React instance you render your app with.',
	      'If you\'re using a precompiled version of React, see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react for integration instructions.'
	    );
	  }
	
	  didWarn = true;
	}
	
	var RootInstanceProvider = {
	  injection: {
	    injectProvider: function (provider) {
	      injectedProvider = provider;
	    }
	  },
	
	  getRootInstances: function (ReactMount) {
	    if (injectedProvider) {
	      return injectedProvider.getRootInstances();
	    }
	
	    var instances = ReactMount && getRootInstancesFromReactMount(ReactMount) || [];
	    if (!Object.keys(instances).length) {
	      warnOnce();
	    }
	
	    return instances;
	  }
	};
	
	module.exports = RootInstanceProvider;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	function getRootInstancesFromReactMount(ReactMount) {
	  return ReactMount._instancesByReactRootID || ReactMount._instancesByContainerID || [];
	}
	
	module.exports = getRootInstancesFromReactMount;

/***/ },
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(68);


/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function injectTapEventPlugin () {
	  __webpack_require__(20).injection.injectEventPluginsByName({
	    "TapEventPlugin":       __webpack_require__(172)
	  });
	};


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TapEventPlugin
	 * @typechecks static-only
	 */
	
	"use strict";
	
	var EventConstants = __webpack_require__(18);
	var EventPluginUtils = __webpack_require__(22);
	var EventPropagators = __webpack_require__(85);
	var SyntheticUIEvent = __webpack_require__(99);
	var TouchEventUtils = __webpack_require__(173);
	var ViewportMetrics = __webpack_require__(30);
	
	var keyOf = __webpack_require__(174);
	var topLevelTypes = EventConstants.topLevelTypes;
	
	var isStartish = EventPluginUtils.isStartish;
	var isEndish = EventPluginUtils.isEndish;
	
	var isTouch = function(topLevelType) {
	  var touchTypes = [
	    topLevelTypes.topTouchCancel,
	    topLevelTypes.topTouchEnd,
	    topLevelTypes.topTouchStart,
	    topLevelTypes.topTouchMove
	  ];
	  return touchTypes.indexOf(topLevelType) >= 0;
	}
	
	/**
	 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
	 * in order to still be considered a 'tap' event.
	 */
	var tapMoveThreshold = 10;
	var ignoreMouseThreshold = 750;
	var startCoords = {x: null, y: null};
	var lastTouchEvent = null;
	
	var Axis = {
	  x: {page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft'},
	  y: {page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop'}
	};
	
	function getAxisCoordOfEvent(axis, nativeEvent) {
	  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
	  if (singleTouch) {
	    return singleTouch[axis.page];
	  }
	  return axis.page in nativeEvent ?
	    nativeEvent[axis.page] :
	    nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
	}
	
	function getDistance(coords, nativeEvent) {
	  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
	  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
	  return Math.pow(
	    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
	    0.5
	  );
	}
	
	var touchEvents = [
	  topLevelTypes.topTouchStart,
	  topLevelTypes.topTouchCancel,
	  topLevelTypes.topTouchEnd,
	  topLevelTypes.topTouchMove,
	];
	
	var dependencies = [
	  topLevelTypes.topMouseDown,
	  topLevelTypes.topMouseMove,
	  topLevelTypes.topMouseUp,
	].concat(touchEvents);
	
	var eventTypes = {
	  touchTap: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onTouchTap: null}),
	      captured: keyOf({onTouchTapCapture: null})
	    },
	    dependencies: dependencies
	  }
	};
	
	var now = (function() {
	  if (Date.now) {
	    return Date.now;
	  } else {
	    // IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
	    return function () {
	      return +new Date;
	    }
	  }
	})();
	
	var TapEventPlugin = {
	
	  tapMoveThreshold: tapMoveThreshold,
	
	  ignoreMouseThreshold: ignoreMouseThreshold,
	
	  eventTypes: eventTypes,
	
	  /**
	   * @param {string} topLevelType Record from `EventConstants`.
	   * @param {DOMEventTarget} topLevelTarget The listening component root node.
	   * @param {string} topLevelTargetID ID of `topLevelTarget`.
	   * @param {object} nativeEvent Native browser event.
	   * @return {*} An accumulation of synthetic events.
	   * @see {EventPluginHub.extractEvents}
	   */
	  extractEvents: function(
	      topLevelType,
	      topLevelTarget,
	      topLevelTargetID,
	      nativeEvent,
	      nativeEventTarget) {
	
	    if (isTouch(topLevelType)) {
	      lastTouchEvent = now();
	    } else {
	      if (lastTouchEvent && (now() - lastTouchEvent) < ignoreMouseThreshold) {
	        return null;
	      }
	    }
	
	    if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
	      return null;
	    }
	    var event = null;
	    var distance = getDistance(startCoords, nativeEvent);
	    if (isEndish(topLevelType) && distance < tapMoveThreshold) {
	      event = SyntheticUIEvent.getPooled(
	        eventTypes.touchTap,
	        topLevelTargetID,
	        nativeEvent,
	        nativeEventTarget
	      );
	    }
	    if (isStartish(topLevelType)) {
	      startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
	      startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
	    } else if (isEndish(topLevelType)) {
	      startCoords.x = 0;
	      startCoords.y = 0;
	    }
	    EventPropagators.accumulateTwoPhaseDispatches(event);
	    return event;
	  }
	
	};
	
	module.exports = TapEventPlugin;


/***/ },
/* 173 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TouchEventUtils
	 */
	
	var TouchEventUtils = {
	  /**
	   * Utility function for common case of extracting out the primary touch from a
	   * touch event.
	   * - `touchEnd` events usually do not have the `touches` property.
	   *   http://stackoverflow.com/questions/3666929/
	   *   mobile-sarai-touchend-event-not-firing-when-last-touch-is-removed
	   *
	   * @param {Event} nativeEvent Native event that may or may not be a touch.
	   * @return {TouchesObject?} an object with pageX and pageY or null.
	   */
	  extractSingleTouch: function(nativeEvent) {
	    var touches = nativeEvent.touches;
	    var changedTouches = nativeEvent.changedTouches;
	    var hasTouches = touches && touches.length > 0;
	    var hasChangedTouches = changedTouches && changedTouches.length > 0;
	
	    return !hasTouches && hasChangedTouches ? changedTouches[0] :
	           hasTouches ? touches[0] :
	           nativeEvent;
	  }
	};
	
	module.exports = TouchEventUtils;


/***/ },
/* 174 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule keyOf
	 */
	
	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without losing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	"use strict";
	
	var keyOf = function (oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};
	
	module.exports = keyOf;

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	var liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	module.exports = new liquidFlux.API('http://localhost:3000');


/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	var realPackage;
	
	realPackage = __webpack_require__(177);
	
	module.exports = realPackage;


/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	var API, Dispatcher, constantsGenerator, createActions, createQueries, createStore, liquidFlux, mixin;
	
	Dispatcher = __webpack_require__(178);
	
	mixin = __webpack_require__(181);
	
	API = __webpack_require__(182);
	
	createStore = __webpack_require__(184);
	
	createQueries = __webpack_require__(187);
	
	createActions = __webpack_require__(188);
	
	constantsGenerator = __webpack_require__(189);
	
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
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, Logger;
	
	Logger = __webpack_require__(179)('Dispatcher');
	
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
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	var moment,
	  slice = [].slice;
	
	moment = __webpack_require__(180);
	
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
/* 180 */
/***/ function(module, exports) {

	module.exports = moment;

/***/ },
/* 181 */
/***/ function(module, exports) {

	var slice = [].slice;
	
	module.exports = {
	  registeredListener: [],
	  componentDidMount: function() {
	    var cb, i, len, listener, ref, results;
	    this.registeredListener = [];
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
	      if (listener[3]) {
	        cb = (function(_this) {
	          return function() {
	            var args;
	            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	            if (listener[3].bind(_this).apply(null, args)) {
	              return listener[1]();
	            }
	          };
	        })(this);
	      } else {
	        cb = listener[1];
	      }
	      this.registeredListener.push({
	        store: listener[0],
	        key: listener[2],
	        cb: cb
	      });
	      results.push(listener[0].addListener(listener[2], cb));
	    }
	    return results;
	  },
	  componentWillUnmount: function() {
	    var i, len, listener, ref, results;
	    if (!this.setStoreListener) {
	      return;
	    }
	    ref = this.registeredListener;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      listener = ref[i];
	      results.push(listener.store.removeListener(listener.key, listener.cb));
	    }
	    return results;
	  },
	  componentWillReceiveProps: function(nextProps) {
	    return this.refreshFluxStates(null, nextProps);
	  },
	  getInitialState: function() {
	    if (this.getFluxState) {
	      return this.getFluxState(this.props);
	    } else if (this.getFluxStates) {
	      return this.__deprecatedFluxStates(this.props);
	    } else {
	      return {};
	    }
	  },
	  refreshFluxStates: function(p, props) {
	    props = props ? props : this.props;
	    if (this.getFluxState) {
	      this.setState(this.getFluxState(props));
	    }
	    if (this.getFluxStates) {
	      return this.setState(this.__deprecatedFluxStates(props));
	    }
	  },
	  __deprecatedFluxStates: function(props) {
	    return this.getFluxStates(props);
	  }
	};


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	var API, Logger, bodyHelpers, generateRandomString;
	
	Logger = __webpack_require__(179)('API');
	
	bodyHelpers = __webpack_require__(183);
	
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
/* 183 */
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
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, EventEmitter, Logger, LoggerStore, assign,
	  slice = [].slice;
	
	assign = __webpack_require__(185);
	
	EventEmitter = __webpack_require__(186).EventEmitter;
	
	Logger = __webpack_require__(179)('createStore');
	
	LoggerStore = __webpack_require__(179)('Store');
	
	Dispatcher = __webpack_require__(178);
	
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
	    if (value === void 0 && options.loaded !== true) {
	      options.remotely.bind(Store)();
	      options.loaded = true;
	      return options["default"];
	    } else {
	      return value;
	    }
	  };
	  Store.emitChange = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    if (!args[0]) {
	      args[0] = 'CHANGE';
	    }
	    LoggerStore.log(Store.pod + " -> " + args[0]);
	    return Store.emit.apply(Store, args);
	  };
	  keyWords = ['get', 'update', 'set', 'do', 'is'];
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
/* 185 */
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
/* 186 */
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
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, EventEmitter, Logger, _callQuery, assign, runningManager,
	  slice = [].slice;
	
	assign = __webpack_require__(185);
	
	EventEmitter = __webpack_require__(186).EventEmitter;
	
	Logger = __webpack_require__(179)('createQueries');
	
	Dispatcher = __webpack_require__(178);
	
	runningManager = {
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
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher, Logger;
	
	Logger = __webpack_require__(179)('createActions');
	
	Dispatcher = __webpack_require__(178);
	
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
/* 189 */
/***/ function(module, exports) {

	module.exports = function(prefix, keys) {
	  var i, k, len, response;
	  response = {
	    'ROUTE': 'ROUTE'
	  };
	  for (i = 0, len = keys.length; i < len; i++) {
	    k = keys[i];
	    response[k] = prefix + '.' + k;
	  }
	  return response;
	};


/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var APITester, App, Calendar, Conflicts, Moderator, ModeratorSchedule, ModeratorShift, ModeratorUser, MyShifts, React, Register, Route, Router, Schedule, ScheduleCreate, ScheduleEdit, ScheduleShow, Settings, Welcome, createHistory, liquidFlux, requireAuth, requireModerator;
	
	React = __webpack_require__(66);
	
	Router = __webpack_require__(191).Router;
	
	Route = __webpack_require__(191).Route;
	
	createHistory = __webpack_require__(193);
	
	liquidFlux = __webpack_require__(176);
	
	App = __webpack_require__(249);
	
	ScheduleCreate = __webpack_require__(268);
	
	ScheduleEdit = __webpack_require__(281);
	
	ScheduleShow = __webpack_require__(307);
	
	Register = __webpack_require__(313);
	
	Welcome = Conflicts = MyShifts = Settings = Moderator = ModeratorUser = ModeratorShift = ModeratorSchedule = Schedule = React.createClass({
	  render: function() {
	    return React.createElement("div", null, this.props.children);
	  }
	});
	
	Calendar = APITester = Register;
	
	requireAuth = function(nextState, replaceState) {};
	
	requireModerator = function(nextState, replaceState) {};
	
	liquidFlux.Dispatcher.register('ROUTE', function(route) {
	  return document.location.hash = route;
	});
	
	module.exports = React.createElement(Router, {
	  "history": createHistory({
	    queryKey: false
	  })
	}, React.createElement(Route, {
	  "name": "app",
	  "path": "/",
	  "component": App
	}, React.createElement(Route, {
	  "path": "tester",
	  "component": APITester
	}), React.createElement(Route, {
	  "name": "register",
	  "path": "register",
	  "components": Register
	}), React.createElement(Route, {
	  "name": "register",
	  "path": "register/:step",
	  "components": Register
	}), React.createElement(Route, {
	  "name": "settings",
	  "path": "settings",
	  "component": Settings,
	  "onEnter": requireAuth
	}), React.createElement(Route, {
	  "name": "my",
	  "path": ":event/my",
	  "component": MyShifts,
	  "onEnter": requireAuth
	}), React.createElement(Route, {
	  "name": "new",
	  "path": ":event/new",
	  "component": ScheduleCreate,
	  "onEnter": requireModerator
	}), React.createElement(Route, {
	  "name": "moderator",
	  "path": ":event/moderator",
	  "component": Moderator,
	  "onEnter": requireModerator
	}, React.createElement(Route, {
	  "path": "user",
	  "components": ModeratorUser
	}), React.createElement(Route, {
	  "path": "shifts",
	  "components": ModeratorShift
	}), React.createElement(Route, {
	  "path": "conflicts",
	  "component": Conflicts
	})), React.createElement(Route, {
	  "path": ":event/:scheduleId/edit",
	  "components": ScheduleEdit,
	  "onEnter": requireModerator
	}), React.createElement(Route, {
	  "path": ":event/:scheduleId",
	  "component": ScheduleShow
	}), React.createElement(Route, {
	  "path": ":event",
	  "component": Welcome
	})));
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Router.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, ScheduleStore, Toolbar, liquidFlux;
	
	__webpack_require__(250);
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	ScheduleStore = __webpack_require__(254);
	
	Toolbar = __webpack_require__(257);
	
	module.exports = React.createClass({
	  displayName: 'App',
	  mixins: [liquidFlux.mixin],
	  setStoreListener: function() {
	    return [
	      [
	        ScheduleStore, (function(_this) {
	          return function() {
	            return _this.forceUpdate();
	          };
	        })(this)
	      ]
	    ];
	  },
	  childContextTypes: {
	    dayThreshold: React.PropTypes.number
	  },
	  getChildContext: function() {
	    return {
	      dayThreshold: 6
	    };
	  },
	  render: function() {
	    var event, scheduleId;
	    event = ScheduleStore.getActiveEvent(this.props.params.event);
	    scheduleId = parseInt(this.props.params.scheduleId);
	    return React.createElement("div", {
	      "id": "app"
	    }, React.createElement(Toolbar, {
	      "event": event,
	      "scheduleId": scheduleId
	    }), React.createElement("div", {
	      "id": "content"
	    }, this.props.children));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "index.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(251);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(251, function() {
				var newContent = __webpack_require__(251);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, "body {\n  background-color: #292929;\n  color: #dadada; }\n\nh1, h2, h3, h4, h5 {\n  margin-left: 3%;\n  color: #FFFFFF;\n  font-weight: 200; }\n  h1 a, h2 a, h3 a, h4 a, h5 a {\n    font-size: 50%; }\n\n#content {\n  margin-top: 60px; }\n\n.content {\n  padding-left: 20px;\n  padding-right: 20px; }\n\nblockquote small {\n  opacity: 0.5; }\n\nul.tabs {\n  background-color: rgba(255, 255, 255, 0.02);\n  margin-bottom: 20px; }\n  ul.tabs .tab.disabled a {\n    color: rgba(249, 201, 203, 0.17); }\n  ul.tabs li > a.active {\n    color: #f9c9cb; }\n", ""]);
	
	// exports


/***/ },
/* 252 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	var Queries, constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	Queries = __webpack_require__(255);
	
	constants = __webpack_require__(256);
	
	module.exports = document.sstore = liquidFlux.createStore({
	  pod: 'Schedule',
	  initialise: function() {
	    this.bindAction(constants.LIST_RECIEVE, this.updateList);
	    this.bindAction(constants.LIST_UPDATE, this.updateList);
	    this.bindAction(constants.CREATE, this.doCreate);
	    return this.bindAction(constants.UPDATE, this.doUpdate);
	  },
	  getInitialState: function() {
	    return {
	      schedules: void 0,
	      events: void 0
	    };
	  },
	  get: {
	    schedule: function(scheduleId) {
	      return this.fetch({
	        locally: function() {
	          if (!this.state.schedules) {
	            return;
	          }
	          return this.state.schedules[scheduleId];
	        },
	        remotely: function() {
	          return Queries.getList();
	        },
	        "default": {}
	      });
	    },
	    events: function() {
	      return this.fetch({
	        locally: function() {
	          return this.state.events;
	        },
	        remotely: function() {
	          return Queries.getList();
	        },
	        "default": []
	      });
	    },
	    event: function(event) {
	      return this.fetch({
	        locally: function() {
	          if (this.state.events) {
	            return this.state.events[event];
	          }
	        },
	        remotely: function() {
	          return Queries.getList();
	        },
	        "default": {}
	      });
	    },
	    schedules: function(event) {
	      return this.fetch({
	        locally: function() {
	          if (!this.state.events || !this.state.events[event]) {
	            return;
	          }
	          return this.state.events[event].scheduleList;
	        },
	        remotely: function() {
	          return Queries.getList();
	        },
	        "default": {}
	      });
	    },
	    eventIdByName: function(name) {
	      return this.fetch({
	        locally: function() {
	          if (!this.state.events || !this.state.events[name]) {
	            return;
	          }
	          return this.state.events[name].id;
	        },
	        remotely: function() {
	          return Queries.getList();
	        },
	        "default": 0
	      });
	    },
	    activeEvent: function(title) {
	      return this.fetch({
	        locally: function() {
	          var lastEvent, o, ref;
	          if (!this.state.events) {
	            return;
	          }
	          if (this.state.events[title]) {
	            return title;
	          } else {
	            lastEvent = '';
	            ref = this.state.events;
	            for (title in ref) {
	              o = ref[title];
	              lastEvent = title;
	            }
	            return lastEvent;
	          }
	        },
	        remotely: function() {
	          return Queries.getList();
	        },
	        "default": ''
	      });
	    }
	  },
	  "do": {
	    create: function(payload) {
	      return Queries.createSchedule(payload);
	    },
	    update: function(payload) {
	      return Queries.updateSchedule(payload);
	    }
	  },
	  update: {
	    list: function(res) {
	      var event, i, j, len, len1, path, ref, ref1, schedule;
	      if (!this.state.schedules) {
	        this.state.schedules = {};
	      }
	      this.state.events = {};
	      ref = res.events;
	      for (i = 0, len = ref.length; i < len; i++) {
	        event = ref[i];
	        this.state.events[event.title] = event;
	        this.state.events[event.title].scheduleList = [];
	        ref1 = event.schedules;
	        for (j = 0, len1 = ref1.length; j < len1; j++) {
	          schedule = ref1[j];
	          path = schedule.title.split('/');
	          if (path.length === 1) {
	            path[0] = '-';
	          }
	          schedule.group = path[0];
	          this.state.schedules[schedule.id] = schedule;
	          this.state.events[event.title].scheduleList.push(schedule);
	        }
	      }
	      return this.emitChange();
	    }
	  }
	});


/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	var api, constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	api = __webpack_require__(175);
	
	constants = __webpack_require__(256);
	
	module.exports = liquidFlux.createQueries({
	  pod: 'Schedule',
	  getList: {
	    "do": function() {
	      this.dispatch(constants.LIST_REQUEST);
	      return api.get("/schedules", this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.LIST_RECIEVE, {
	        events: res
	      });
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.LIST_UPDATE, {
	        events: res
	      });
	    }
	  },
	  getSchedule: {
	    "do": function(scheduleId) {
	      return api.get("/schedule/" + scheduleId, this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.RECIEVE, {
	        schedule: res
	      });
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.UPDATE, {
	        schedule: res
	      });
	    }
	  },
	  createSchedule: {
	    "do": function(payload) {
	      return api.post("/schedules", payload).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.ROUTE, "/" + res[0].event + "/" + res[0].id + "/edit");
	    }
	  },
	  updateSchedule: {
	    "do": function(payload) {
	      return api.post("/schedule/" + payload.id, payload).then(this.success, this.error);
	    }
	  },
	  addShift: {
	    "do": function(payload) {
	      return api.post("/schedule/" + payload.id + "/shifts", payload).then(this.success, this.error);
	    }
	  }
	});


/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	var liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	module.exports = liquidFlux.constants('SCHEDULE', ['LIST_REQUEST', 'LIST_RECIEVE', 'LIST_UPDATE', 'REQUEST', 'RECIEVE', 'UPDATE', 'CREATE']);


/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Logo, React, ScheduleSelect;
	
	React = __webpack_require__(66);
	
	ScheduleSelect = __webpack_require__(258);
	
	Logo = __webpack_require__(265);
	
	__webpack_require__(266);
	
	module.exports = React.createClass({
	  displayName: 'Toolbar',
	  render: function() {
	    return React.createElement("div", {
	      "id": "toolbar"
	    }, React.createElement("div", {
	      "className": "left"
	    }, React.createElement(Logo, null), React.createElement(ScheduleSelect, {
	      "event": this.props.event,
	      "scheduleId": this.props.scheduleId
	    })), React.createElement("div", {
	      "className": "right"
	    }, "right"));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Toolbar.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var DropDown, React, ScheduleStore, liquidFlux;
	
	React = __webpack_require__(66);
	
	ScheduleStore = __webpack_require__(254);
	
	liquidFlux = __webpack_require__(176);
	
	DropDown = __webpack_require__(259);
	
	module.exports = React.createClass({
	  displayName: 'ScheduleSelect',
	  mixins: [liquidFlux.mixin],
	  getFluxStates: function(props) {
	    return {
	      events: ScheduleStore.getEvents(),
	      schedules: ScheduleStore.getSchedules(props.event)
	    };
	  },
	  setStoreListener: function() {
	    return [[ScheduleStore, this.refreshFluxStates]];
	  },
	  render: function() {
	    var event, eventOptions, eventPlaceholder, ref, schedule, t;
	    eventPlaceholder = 'Jahr';
	    eventOptions = [];
	    ref = this.state.events;
	    for (t in ref) {
	      event = ref[t];
	      eventOptions.push({
	        href: '#/' + event.title,
	        label: event.title
	      });
	      if (event.title === this.props.event) {
	        eventPlaceholder = this.props.event;
	      }
	    }
	    schedule = this.groupsToOptions();
	    schedule.options.push({
	      href: "#/" + this.props.event + "/new",
	      label: '+ Neuen Schichtplan',
	      className: 'mod'
	    });
	    return React.createElement("div", {
	      "className": "schedule-selector"
	    }, React.createElement(DropDown, {
	      "id": "event-selector",
	      "menu": eventOptions,
	      "className": "",
	      "buttonText": eventPlaceholder,
	      "style": {
	        width: 80
	      }
	    }), React.createElement(DropDown, {
	      "id": "schedule-selector",
	      "menu": schedule.options,
	      "className": "",
	      "buttonText": schedule.placeholder,
	      "style": {
	        width: 175
	      }
	    }));
	  },
	  groupsToOptions: function() {
	    var group, groups, i, id, len, options, placeholder, ref, schedule, schedules, title, title2;
	    groups = {};
	    ref = this.state.schedules;
	    for (id in ref) {
	      schedule = ref[id];
	      if (groups[schedule.group]) {
	        groups[schedule.group].push(schedule);
	      } else {
	        groups[schedule.group] = [schedule];
	      }
	    }
	    options = [];
	    placeholder = 'Schichtplan';
	    for (group in groups) {
	      schedules = groups[group];
	      options.push({
	        className: 'optgroup',
	        disabled: true,
	        label: group === '-' ? 'Sonstige' : group
	      });
	      for (i = 0, len = schedules.length; i < len; i++) {
	        schedule = schedules[i];
	        title = schedule.title.split('/');
	        title2 = title.length > 1 ? title[1] : title[0];
	        options.push({
	          href: "#/" + this.props.event + "/" + schedule.id,
	          label: title2
	        });
	        if (schedule.id === this.props.scheduleId) {
	          placeholder = title2;
	        }
	      }
	    }
	    return {
	      options: options,
	      placeholder: placeholder
	    };
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ScheduleSelect.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var MenuEntry, React;
	
	__webpack_require__(260);
	
	React = __webpack_require__(66);
	
	MenuEntry = React.createClass({
	  displayName: 'MenuEntry',
	  handleClick: function(e) {
	    if (!this.props.href || this.props.href === '#') {
	      e.preventDefault();
	    }
	    return this.props.handler(this.props.value);
	  },
	  render: function() {
	    var classNames;
	    classNames = [];
	    if (this.props.active) {
	      classNames.push('active selected');
	    }
	    if (this.props.className) {
	      classNames.push(this.props.className);
	    }
	    return React.createElement("li", {
	      "className": classNames.join(' ')
	    }, (this.props.disabled ? React.createElement("span", null, this.props.children) : React.createElement("a", {
	      "href": (this.props.href ? this.props.href : '#'),
	      "onClick": this.handleClick
	    }, this.props.children)));
	  }
	});
	
	module.exports = React.createClass({
	  displayName: 'DropDown',
	  getInitialState: function() {
	    return {
	      searchString: ''
	    };
	  },
	  componentDidMount: function() {
	    $(this.refs.button).dropdown({
	      belowOrigin: true
	    });
	    if (this.props.searchable) {
	      return $(this.refs.search).click(function(e) {
	        e.preventDefault();
	        return e.stopPropagation();
	      });
	    }
	  },
	  change: function(value) {
	    if (this.props.onChange) {
	      return this.props.onChange(value);
	    }
	  },
	  focus: function(e) {
	    if (this.props.onFocus) {
	      return this.props.onFocus();
	    }
	  },
	  getMenu: function(menu) {
	    var entries, i, j, len, option;
	    entries = [];
	    for (i = j = 0, len = menu.length; j < len; i = ++j) {
	      option = menu[i];
	      entries.push(React.createElement(MenuEntry, React.__spread({
	        "key": i
	      }, option, {
	        "active": this.props.activeValue !== void 0 && option.value === this.props.activeValue,
	        "handler": this.change
	      }), option.label));
	    }
	    return entries;
	  },
	  updateSearch: function() {
	    return this.setState({
	      searchString: this.refs.search.value
	    });
	  },
	  render: function() {
	    var menu, searching;
	    menu = this.props.menu;
	    if (this.props.searchable && this.state.searchString) {
	      searching = this.state.searchString.toLowerCase();
	      menu = menu.filter(function(o) {
	        var j, key, len, ref;
	        if (o.searchKeys) {
	          ref = o.searchKeys;
	          for (j = 0, len = ref.length; j < len; j++) {
	            key = ref[j];
	            if (key.toLowerCase().indexOf(searching) === 0) {
	              return true;
	            }
	          }
	        }
	        return false;
	      });
	    }
	    return React.createElement("div", {
	      "className": (this.props.className ? this.props.className : void 0),
	      "style": this.props.style
	    }, React.createElement("input", {
	      "type": "text",
	      "className": "select-dropdown",
	      "tabIndex": "-1",
	      "readOnly": "true",
	      "value": this.props.buttonText,
	      "data-activates": this.props.id,
	      "ref": "button",
	      "onClick": this.focus
	    }), React.createElement("ul", {
	      "id": this.props.id,
	      "className": "dropdown-content select-dropdown"
	    }, (this.props.searchable ? React.createElement("li", {
	      "className": "search"
	    }, React.createElement("input", {
	      "ref": "search",
	      "type": "text",
	      "placeholder": "Suche...",
	      "value": this.state.searchString,
	      "onChange": this.updateSearch
	    })) : void 0), this.getMenu(menu)));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "DropDown.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(261);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(261, function() {
				var newContent = __webpack_require__(261);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".dropdown-content {\n  background-color: #303030;\n  max-height: 300px; }\n  .dropdown-content li > a, .dropdown-content li > span {\n    color: #fff; }\n  .dropdown-content li:hover, .dropdown-content li.active {\n    background-color: rgba(0, 0, 0, 0.04); }\n  .dropdown-content li.active a {\n    color: #FF4081; }\n  .dropdown-content li.search {\n    overflow: hidden; }\n    .dropdown-content li.search input {\n      color: white;\n      margin: 0;\n      padding: 0 20px;\n      width: 100%; }\n\n.select-wrapper span.caret {\n  color: #B1B1B1; }\n", ""]);
	
	// exports


/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isReactClassish = __webpack_require__(263),
	    isReactElementish = __webpack_require__(264);
	
	function makeExportsHot(m, React) {
	  if (isReactElementish(m.exports, React)) {
	    // React elements are never valid React classes
	    return false;
	  }
	
	  var freshExports = m.exports,
	      exportsReactClass = isReactClassish(m.exports, React),
	      foundReactClasses = false;
	
	  if (exportsReactClass) {
	    m.exports = m.makeHot(m.exports, '__MODULE_EXPORTS');
	    foundReactClasses = true;
	  }
	
	  for (var key in m.exports) {
	    if (!Object.prototype.hasOwnProperty.call(freshExports, key)) {
	      continue;
	    }
	
	    if (exportsReactClass && key === 'type') {
	      // React 0.12 also puts classes under `type` property for compat.
	      // Skip to avoid updating twice.
	      continue;
	    }
	
	    var value;
	    try {
	      value = freshExports[key];
	    } catch (err) {
	      continue;
	    }
	
	    if (!isReactClassish(value, React)) {
	      continue;
	    }
	
	    if (Object.getOwnPropertyDescriptor(m.exports, key).writable) {
	      m.exports[key] = m.makeHot(value, '__MODULE_EXPORTS_' + key);
	      foundReactClasses = true;
	    } else {
	      console.warn("Can't make class " + key + " hot reloadable due to being read-only. To fix this you can try two solutions. First, you can exclude files or directories (for example, /node_modules/) using 'exclude' option in loader configuration. Second, if you are using Babel, you can enable loose mode for `es6.modules` using the 'loose' option. See: http://babeljs.io/docs/advanced/loose/ and http://babeljs.io/docs/usage/options/");
	    }
	  }
	
	  return foundReactClasses;
	}
	
	module.exports = makeExportsHot;


/***/ },
/* 263 */
/***/ function(module, exports) {

	function hasRender(Class) {
	  var prototype = Class.prototype;
	  if (!prototype) {
	    return false;
	  }
	
	  return typeof prototype.render === 'function';
	}
	
	function descendsFromReactComponent(Class, React) {
	  if (!React.Component) {
	    return false;
	  }
	
	  var Base = Object.getPrototypeOf(Class);
	  while (Base) {
	    if (Base === React.Component) {
	      return true;
	    }
	
	    Base = Object.getPrototypeOf(Base);
	  }
	
	  return false;
	}
	
	function isReactClassish(Class, React) {
	  if (typeof Class !== 'function') {
	    return false;
	  }
	
	  // React 0.13
	  if (hasRender(Class) || descendsFromReactComponent(Class, React)) {
	    return true;
	  }
	
	  // React 0.12 and earlier
	  if (Class.type && hasRender(Class.type)) {
	    return true;
	  }
	
	  return false;
	}
	
	module.exports = isReactClassish;

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	var isReactClassish = __webpack_require__(263);
	
	function isReactElementish(obj, React) {
	  if (!obj) {
	    return false;
	  }
	
	  return Object.prototype.toString.call(obj.props) === '[object Object]' &&
	         isReactClassish(obj.type, React);
	}
	
	module.exports = isReactElementish;

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React;
	
	React = __webpack_require__(66);
	
	module.exports = React.createClass({
	  displayName: 'Logo',
	  render: function() {
	    return React.createElement("svg", {
	      "className": "logo",
	      "xmlns": "http://www.w3.org/2000/svg",
	      "height": "30",
	      "width": "21",
	      "version": "1.1"
	    }, React.createElement("defs", null, React.createElement("clipPath", {
	      "id": "b"
	    }, React.createElement("path", {
	      "d": "m0 1.46e3h1.09e3v-1.46e3h-1.09e3v1.46e3z"
	    })), React.createElement("clipPath", {
	      "id": "a"
	    }, React.createElement("path", {
	      "d": "m158 1.38e3h860v-1.24e3h-860v1.24e3z"
	    }))), React.createElement("g", {
	      "transform": "matrix(1.25 0 0 -1.25 -11.7 1.83e3)"
	    }, React.createElement("g", {
	      "transform": "matrix(.0195 0 0 .0193 6.25 1.44e3)"
	    }, React.createElement("g", {
	      "clipPath": "url(#b)"
	    }, React.createElement("g", {
	      "clipPath": "url(#a)"
	    }, React.createElement("g", {
	      "transform": "translate(477 479)"
	    }, React.createElement("path", {
	      "d": "m0 0c4.07-4.06 12.9-13.4 19.2-18.4 8.62-6.75 9.95-9.67 18-17 17-15.5 27.3-25.4 42-47 7.45-11 18-26.6 22-39 9.39-29.2 6.99-53.4-15-78.6-15.5-17.8-26.4-26.5-46-38.4-23.3-14.1-48.4-31-72.9-43-18.2-8.93-34.5-16.5-53.3-24-12.5-4.99-25.8-8.55-38-14-12-5.34-23-3.33-34.7 1.33-16.8 6.72-26.9 15.9-36.6 30-8.44 12.2-16 24.6-20.5 38.9-3.66 11.8-7.63 23.4-11.5 35.1-3.92 11.7 0.286 22.4 11.9 25.8 18.8 5.4 37.8 9.95 56.6 15 13.7 3.64 27.4 7.34 41 11.2 18.5 5.31 37.1 10.5 55.4 16.4 11 3.6 14.1 4.23 24.7 9.89 4.15 2.21 4.04 8.66 3.63 12.2-0.853 7.48-7.7 14.3-16 21-16 16.9-21.3 21-37.3 35.5-17.9 16.3-38.2 35.4-56.5 51.3-16.5 14.3-24.4 30.1-33.3 48.6-4.08 8.46-8.66 19.6-8.92 28.9-0.545 19.5-0.287 15.7 0.172 23.3 0.917 15.2 3.79 30.2 6.1 45.3 3.64 23.7 7.68 47.4 11.2 71.2 1.95 13.2 3.48 26.7 5.88 39.9 3.41 18.6 7.34 37 10.9 55.6 2.66 13.9 4.11 28.1 6.23 42.1s4.68 28 6.48 42c1.09 8.54 0.075 15.9-9.01 21.4-11.9 7.16-22 17.2-33.7 24.7-10.5 6.73-25.5 15.4-36.1 22-14.5 9.07-23.2 15.7-38 26.2-14.9 10.6-29.2 22.4-43.6 33.8-14.8 11.7-21 26.3-19.5 45.3 1.15 14.4 0.234 29 0.235 43.5 0.001 49.6 0.466 99.1-0.346 149-0.19 11.6 3.44 19.8 10.6 28 20.7 23.8 40.1 48.7 61.7 71.6 16.3 17.4 35.9 31 54 47.2 16.9 15.1 37.4 2.97 54.2-24.5 5.53-9.04 10.1-15.6 2.05-24.1-13.3-14-25.5-29-38.8-43.1-9.08-9.58-19.6-17.8-28.7-27.4-7.9-8.37-11.6-12.8-18.7-21.9-3.3-4.22-7.38-9.35-10.5-13.7-10.9-14.8-9.56-35.2-7.8-52.2 2.19-21.2 3.91-43 5.63-64.8 1.21-15.4 4.5-31.2 4.83-46.6 0.172-8.06 4.29-13.7 10.8-17.2 12.5-6.81 27.4-12 41.7-15.2 16.9-3.84 26.2-7.22 43.3-13.3 20.4-7.24 38.6-17.5 57.5-28 9.37-5.19 19.8-5.18 28.4 0.836 7.07 4.95 7.52 13.7 7.3 22.3-0.466 18.5-12.3 31.7-20.5 46.7-12.2 22.5-18.6 44.9-16.9 72.3 0.975 15.1 1.4 25.9 3.85 38.4 4.64 23.8 16.9 49 33.7 66.9 6.82 7.25 9.44 10.1 16.3 17.2 13.1 13.6 31.9 20.4 50.2 21.6 44.2 2.7 73.9-21.8 95.9-56 7.96-12.4 10.6-29.2 12.4-44.3 3.93-33.3 5.8-67-6.4-99.1-5.54-14.6-15.3-27.5-22.2-41.6-13-20-27.9-34-49.1-42-7.58-2.83-13.6-7.12-17.1-15.6-4.74-11.5 0.265-22.8 12.7-22.4 12.8 0.388 23.5 0.916 36.2 1.33 23.2 0.76 34.4-0.393 48.8-10.1 34.5-23.1 64.4-49.8 98.5-73 23-15.6 47-29.6 70.7-44.2 4.53-2.79 9.39-6.63 14.3-6.88 5.91-0.303 12.7 1.46 17.9 4.48 15.2 8.92 30.1 18.5 44.5 28.6 15 10.6 18.2 14.2 31.8 26.4 17 15.3 25.2 28.4 38.7 44.7 10.6 12.8 11.2 14.9 24.2 27 11.3 10.6 14 13.6 28.1 14.1 12.5 0.464 14.6-5.73 28.1-16.1 5.21-6.25 10.8-9.15 6.77-25-3.61-14.2-9.19-21.3-17.3-33.5-10.7-16-14.4-22-27-36.3-13.9-15.7-28.7-34.9-44.6-48.8-18.8-16.4-38.3-31.8-57.1-48.2-14.8-12.9-28.4-27.4-43.6-39.8-16.4-13.3-28.8-17-50.4-3.88-26.2 15.9-51.4 37.1-77.8 52.8-5.68 3.37-61.8 33.5-86.9 46.1-5.96 3-12.9 6.08-22.1 9.21-10.3 4.28-25.3-7.28-29.6-19.5-8.8-17-14.6-30-24.6-45-5-8-25.9-49-33.6-60-11.9-16-19.4-35-13.2-55 1.72-5.42 3.7-9.27 8.83-11.5 16.4-7.08 33.4-12.7 50.3-18.5 21.1-7.28 122-37 136-41.6 24.3-7.89 48.6-15.6 72.6-24.4 6.14-2.25 16.6-10.6 21.3-15.6 8.81-9.41 13.8-15.5 19.7-26.7 11.8-22.3 20.7-45.2 20.5-71.7 1.86-31.3 5.14-61.9 9.53-93 2.74-19.4 4.36-37.7 5.84-57.4 4.28-29.5 2.57-57.6 3-89-0.486-11.7-3.08-19.7-13-23-18.7-6.18-37.9-10.7-57.1-15.1-20.8-4.75-41.8-8.91-62.9-12.5-8.27-1.41-17.1-1.7-25.4-0.454-12.9 1.95-17.5 12-17.2 24.9 7.48 38.6 17.8 65.1 25.2 100 5.19 24.5 9.27 50.1 10.9 75 1.3 19.3 1.57 38.7 1.6 58.1 0.012 7.4-2.1 14.8-2.9 22.2-1.1 10.1-8.8 13.8-16.6 16.3-17.4 5.55-35.1 10.3-52.8 15.2-37.3 10.3-74.5 20.8-112 30.4-12.9 4.17-28.9 5.89-37.5 5.83-1.08-0.01-2.14-2.09-1.4-2.83"
	    })))))));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Logo.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(267);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(267, function() {
				var newContent = __webpack_require__(267);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, "@charset \"UTF-8\";\n#toolbar {\n  position: fixed;\n  z-index: 10000;\n  top: 0;\n  left: 0;\n  background-color: #333;\n  height: 38px;\n  width: 100%;\n  padding-left: 1%;\n  border-bottom: 1px solid #444; }\n\nsvg.logo {\n  float: left;\n  fill: white;\n  margin: 6px 10px; }\n\n.schedule-selector {\n  float: left; }\n  .schedule-selector > div {\n    float: left;\n    position: relative; }\n    .schedule-selector > div::before {\n      content: '\\25BC';\n      float: right;\n      position: absolute;\n      right: 5px;\n      top: 8px;\n      opacity: 0.3; }\n    .schedule-selector > div input {\n      background: none;\n      border: 0;\n      border-bottom: 2px solid #aaa;\n      height: 36px;\n      padding: 0;\n      padding-left: 15px;\n      text-align: left; }\n    .schedule-selector > div ul.dropdown-content {\n      background-color: #303030;\n      border-top: 2px solid #0097A7;\n      max-height: none; }\n      .schedule-selector > div ul.dropdown-content li {\n        line-height: 1.2rem; }\n        .schedule-selector > div ul.dropdown-content li a {\n          color: #fff;\n          padding: 5px 20px 5px 20px;\n          font-size: 15px; }\n        .schedule-selector > div ul.dropdown-content li:hover {\n          background-color: rgba(0, 0, 0, 0.04); }\n      .schedule-selector > div ul.dropdown-content li.mod a {\n        padding: 5px 10px;\n        opacity: 0.3;\n        font-size: 0.8em; }\n      .schedule-selector > div ul.dropdown-content li.optgroup > span {\n        color: white;\n        opacity: 0.3;\n        padding: 8px 15px 2px 10px;\n        font-size: 13px; }\n      .schedule-selector > div ul.dropdown-content li.optgroup:hover {\n        background: none; }\n      .schedule-selector > div ul.dropdown-content li.optgroup li a {\n        padding: 5px 15px 5px  25px; }\n", ""]);
	
	// exports


/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Actions, Form, Hour, React, Select, Store, SubmitButton, TextArea, TextField, helpers;
	
	React = __webpack_require__(66);
	
	Actions = __webpack_require__(269);
	
	Store = __webpack_require__(254);
	
	Form = __webpack_require__(270);
	
	TextField = __webpack_require__(274);
	
	Select = __webpack_require__(276);
	
	Hour = __webpack_require__(277);
	
	TextArea = __webpack_require__(278);
	
	SubmitButton = __webpack_require__(279);
	
	helpers = __webpack_require__(280);
	
	module.exports = React.createClass({
	  displayName: 'ScheduleCreate',
	  saveForm: function(values) {
	    values.eventId = Store.getEventIdByName(this.props.routeParams.event);
	    return Actions.create(values);
	  },
	  render: function() {
	    return React.createElement("div", null, React.createElement("h4", {
	      "className": "header"
	    }, "Neuen Schichtplan erstellen"), React.createElement(Form, {
	      "className": "row",
	      "onSubmit": this.saveForm,
	      "overlay": true
	    }, React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(TextField, {
	      "name": "title",
	      "label": "Titel",
	      "checkValue": helpers.checks.title
	    })), React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(Select, {
	      "name": "rating",
	      "label": "Bewertung",
	      "options": helpers.ratings,
	      "value": 0.,
	      "checkValue": helpers.checks.rating
	    })), React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(Hour, {
	      "name": "start",
	      "label": "Beginn",
	      "checkValue": helpers.checks.start
	    })), React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(Hour, {
	      "name": "end",
	      "label": "Ende",
	      "checkValue": helpers.checks.end
	    })), React.createElement("div", {
	      "className": "col s12"
	    }, React.createElement(TextArea, {
	      "name": "description",
	      "label": "Beschreibung"
	    })), React.createElement("div", {
	      "className": "col s12 right-align"
	    }, React.createElement(SubmitButton, null, React.createElement("i", {
	      "className": "mdi mdi-send right"
	    }), "Erstellen"))));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Create.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	var constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	constants = __webpack_require__(256);
	
	module.exports = liquidFlux.createActions({
	  create: function(payload) {
	    return this.dispatch(constants.CREATE, payload);
	  },
	  update: function(payload) {
	    return this.dispatch(constants.UPDATE, payload);
	  }
	});


/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	module.exports = __webpack_require__(271);
	
	module.exports.TextField = __webpack_require__(274);
	
	module.exports.Select = __webpack_require__(276);
	
	module.exports.Hour = __webpack_require__(277);
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "index.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React;
	
	__webpack_require__(272);
	
	React = __webpack_require__(66);
	
	module.exports = React.createClass({
	  displayName: 'Form',
	  getInitialState: function() {
	    return {
	      saving: false,
	      values: {},
	      defaultValues: {},
	      errors: []
	    };
	  },
	  setDefaultValue: function(key, value) {
	    var v;
	    v = this.state.defaultValues;
	    v[key] = value;
	    return this.setState({
	      saving: false,
	      defaultValues: v
	    });
	  },
	  onChange: function(key, value) {
	    var v;
	    v = this.state.values;
	    v[key] = value;
	    return this.setState({
	      values: v
	    });
	  },
	  setError: function(key, occured) {
	    var errors;
	    errors = this.state.errors;
	    if (occured) {
	      if (errors.indexOf(key) === -1) {
	        errors.push(key);
	        return this.setState({
	          errors: errors
	        });
	      }
	    } else {
	      if (errors.indexOf(key) !== -1) {
	        errors.splice(errors.indexOf(key), 1);
	        return this.setState({
	          errors: errors
	        });
	      }
	    }
	  },
	  addProps: function(children) {
	    return React.Children.map(children, (function(_this) {
	      return function(child) {
	        if (typeof child !== 'object' || !child) {
	          return child;
	        }
	        if (typeof child.type === 'function') {
	          return React.cloneElement(child, {
	            _form_handlers: {
	              onChange: _this.onChange,
	              setDefaultValue: _this.setDefaultValue,
	              setError: _this.setError,
	              submit: _this.submit
	            },
	            _form_values: _this.state.values,
	            _form_errors: _this.state.errors
	          });
	        } else if (child.props && child.props.children) {
	          return React.cloneElement(child, {
	            children: _this.addProps(child.props.children)
	          });
	        } else {
	          return React.cloneElement(child);
	        }
	      };
	    })(this));
	  },
	  submit: function() {
	    var changes, count, key;
	    if (!this.props.onSubmit) {
	      return;
	    }
	    if (this.props.onlyChanges) {
	      changes = {};
	      count = 0;
	      for (key in this.state.defaultValues) {
	        if (this.state.values[key] !== this.state.defaultValues[key]) {
	          changes[key] = this.state.values[key];
	          count++;
	        }
	      }
	      if (count) {
	        this.setState({
	          saving: true
	        });
	        return this.props.onSubmit(changes, this.state.defaultValues);
	      }
	    } else {
	      this.setState({
	        saving: true
	      });
	      return this.props.onSubmit(this.state.values, this.state.defaultValues);
	    }
	  },
	  render: function() {
	    var children, className, index;
	    index = 0;
	    children = this.addProps(this.props.children);
	    className = 'form';
	    if (this.props.className) {
	      className += ' ' + this.props.className;
	    }
	    if (this.state.saving && this.props.overlay) {
	      className += ' saving';
	    }
	    return React.createElement("div", {
	      "className": className
	    }, children, (this.state.saving && this.props.overlay ? React.createElement("div", {
	      "className": "overlay"
	    }, React.createElement("div", {
	      "className": "preloader-wrapper active"
	    }, React.createElement("div", {
	      "className": "spinner-layer spinner-blue-only"
	    }, React.createElement("div", {
	      "className": "circle-clipper left"
	    }, React.createElement("div", {
	      "className": "circle"
	    })), React.createElement("div", {
	      "className": "gap-patch"
	    }, React.createElement("div", {
	      "className": "circle"
	    })), React.createElement("div", {
	      "className": "circle-clipper right"
	    }, React.createElement("div", {
	      "className": "circle"
	    }))))) : void 0));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Form.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(273);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(273, function() {
				var newContent = __webpack_require__(273);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var InputMixin, React;
	
	React = __webpack_require__(66);
	
	InputMixin = __webpack_require__(275);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'TextField',
	  onChange: function() {
	    return this.update(this.refs.input.value);
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "input-field " + (this.props.className ? this.props.className : '')
	    }, React.createElement("input", {
	      "placeholder": "",
	      "id": "reactform-" + this.props.name,
	      "type": (this.props.type ? this.props.type : "text"),
	      "value": this.getValue(),
	      "onChange": this.onChange,
	      "onFocus": this.touch,
	      "ref": "input",
	      "className": (this.state.errorText && this.isTouched() ? 'invalid' : ''),
	      "disabled": this.props.disabled
	    }), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name,
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "TextField.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 275 */
/***/ function(module, exports) {

	module.exports = {
	  getInitialState: function() {
	    return {
	      errorText: false,
	      _touched: false,
	      defaultErrorFor: false
	    };
	  },
	  touch: function() {
	    if (!this.state._touched) {
	      return this.setState({
	        _touched: true
	      });
	    }
	  },
	  isTouched: function() {
	    return this.state._touched;
	  },
	  componentWillMount: function() {
	    this.update(this.props.value);
	    return this.props._form_handlers.setDefaultValue(this.props.name, this.props.value);
	  },
	  componentWillReceiveProps: function(nextProps) {
	    if (nextProps.value !== this.props.value) {
	      this.update(nextProps.value);
	      return this.props._form_handlers.setDefaultValue(nextProps.name, nextProps.value);
	    } else {
	      return this.check(nextProps._form_values[nextProps.name], nextProps._form_values);
	    }
	  },
	  update: function(value) {
	    this.props._form_handlers.onChange(this.props.name, value);
	    return this.check(value, this.props._form_values);
	  },
	  check: function(value, formValues) {
	    var checker, error, i, len, ref;
	    if (this.props.checkValue) {
	      if (typeof this.props.checkValue === 'object') {
	        ref = this.props.checkValue;
	        for (i = 0, len = ref.length; i < len; i++) {
	          checker = ref[i];
	          error = checker(value, formValues);
	          if (error) {
	            break;
	          }
	        }
	      } else {
	        error = this.props.checkValue(value, formValues);
	      }
	    }
	    if (this.props.errorText && this.props.errorFor === value) {
	      error = this.props.errorText;
	    }
	    if (this.state.errorText !== error) {
	      this.setState({
	        errorText: error
	      });
	      return this.props._form_handlers.setError(this.props.name, error);
	    }
	  },
	  getValue: function() {
	    if (this.props._form_values) {
	      return this.props._form_values[this.props.name];
	    }
	  }
	};


/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var DropDown, InputMixin, React;
	
	React = __webpack_require__(66);
	
	InputMixin = __webpack_require__(275);
	
	DropDown = __webpack_require__(259);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'Select',
	  onChange: function(value) {
	    return this.update(value);
	  },
	  getLabel: function() {
	    var i, len, option, ref, value;
	    value = this.getValue();
	    ref = this.props.options;
	    for (i = 0, len = ref.length; i < len; i++) {
	      option = ref[i];
	      if (option.value === value) {
	        return option.label;
	      }
	    }
	    return this.props.placeholder;
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "select-wrapper input-field"
	    }, React.createElement("span", {
	      "className": "caret"
	    }, "▼"), React.createElement(DropDown, {
	      "id": "reactform-" + this.props.name,
	      "menu": this.props.options,
	      "onChange": this.onChange,
	      "onFocus": this.touch,
	      "className": (this.state.errorText && this.isTouched() ? 'invalid' : ''),
	      "buttonText": this.getLabel(),
	      "activeValue": this.getValue()
	    }), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name,
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Select.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var DropDown, InputMixin, React, hours, i, j, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	InputMixin = __webpack_require__(275);
	
	DropDown = __webpack_require__(259);
	
	hours = [];
	
	for (i = j = 0; j < 24; i = ++j) {
	  hours.push({
	    value: i,
	    label: (i < 10 ? ' ' + i : i) + ':00 Uhr'
	  });
	}
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'Hour',
	  element: null,
	  componentDidMount: function() {
	    return document.picker = $(this.refs.date).pickadate({
	      selectMonths: true,
	      closeOnSelect: true,
	      onSet: this.changeDate,
	      monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
	      monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
	      weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
	      weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
	      today: 'Heute',
	      clear: 'Löschen',
	      close: 'Fertig',
	      firstDay: 1,
	      format: 'dddd, dd. mmmm yyyy'
	    });
	  },
	  componentDidUpdate: function() {
	    return this.componentDidMount();
	  },
	  changeDate: function(e) {
	    var newDay, old;
	    this.touch();
	    old = moment(this.getValue());
	    newDay = moment.unix(e.select / 1000);
	    if (old.isValid()) {
	      newDay.hour(old.hour());
	    }
	    return this.update(newDay.format());
	  },
	  changeHour: function(hour) {
	    var date;
	    date = moment(this.getValue());
	    date.hour(hour);
	    return this.update(date.format());
	  },
	  getHourText: function() {
	    return moment(this.getValue()).format('HH:mm');
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s8 m7 input-field"
	    }, React.createElement("input", {
	      "id": "reactform-" + this.props.name + "-day",
	      "type": "date",
	      "className": "datepicker",
	      "ref": "date",
	      "data-value": moment(this.getValue()).format("YYYY/MM/DD"),
	      "value": moment(this.getValue()).format("dddd, D. MMM YYYY"),
	      "className": (this.state.errorText && this.isTouched() ? 'invalid' : ''),
	      "onChange": this.changeDate
	    }), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name + "-day",
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label)), React.createElement("div", {
	      "className": "select-wrapper input-field col s4 m5",
	      "style": {
	        paddingRight: 0
	      }
	    }, React.createElement("span", {
	      "className": "caret"
	    }, "▼"), React.createElement(DropDown, {
	      "id": "reactform-" + this.props.name + "-hour",
	      "menu": hours,
	      "onChange": this.changeHour,
	      "onFocus": this.touch,
	      "buttonText": this.getHourText()
	    })));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Hour.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var InputMixin, React;
	
	React = __webpack_require__(66);
	
	InputMixin = __webpack_require__(275);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'TextArea',
	  onChange: function() {
	    return this.update(this.refs.textarea.value);
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("textarea", {
	      "id": "reactform-" + this.props.name,
	      "ref": "textarea",
	      "className": "materialize-textarea" + (this.state.errorText && this.isTouched() ? ' invalid' : ''),
	      "value": this.getValue(),
	      "onChange": this.onChange,
	      "onFocus": this.touch
	    }), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name,
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "TextArea.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React;
	
	React = __webpack_require__(66);
	
	module.exports = React.createClass({
	  displayName: 'SubmitButton',
	  click: function(e) {
	    e.preventDefault();
	    return this.props._form_handlers.submit();
	  },
	  render: function() {
	    return React.createElement("button", {
	      "className": "waves-effect waves-light btn" + (this.props.className ? ' ' + this.props.className : ''),
	      "onClick": this.click,
	      "style": this.props.style,
	      "disabled": this.props._form_errors.length
	    }, this.props.children);
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "SubmitButton.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	var moment;
	
	moment = __webpack_require__(180);
	
	module.exports = {
	  checks: {
	    title: function(value) {
	      if (!value) {
	        return 'Bitte angeben';
	      }
	      if (value.split('/').length > 2) {
	        return 'Nur ein \'/\' möglich';
	      }
	    },
	    rating: function(value) {
	      if (value < -2 || value > 2) {
	        return 'Ungültiger Wert';
	      }
	    },
	    start: function(value, form) {
	      var end, m;
	      if (!value) {
	        return 'Bitte angeben';
	      }
	      m = moment(value);
	      if (!m.isValid()) {
	        return 'Ungültig';
	      }
	      end = moment(form.end);
	      if (!m.isBefore(end)) {
	        return 'Muss vorm Ende beginnen';
	      }
	      if (end.diff(m, 'days') > 7) {
	        return 'Maximal 7 Tage';
	      }
	    },
	    end: function(value, form) {
	      var m, start;
	      if (!value) {
	        return 'Bitte angeben';
	      }
	      m = moment(value);
	      if (!m.isValid()) {
	        return 'Ungültig';
	      }
	      start = moment(form.start);
	      if (!m.isAfter(start)) {
	        return 'Muss nach dem Start beginnen';
	      }
	      if (m.diff(start, 'days') > 7) {
	        return 'Maximal 7 Tage';
	      }
	    }
	  },
	  ratings: [
	    {
	      value: 2,
	      label: 'Sehr hässlich'
	    }, {
	      value: 1,
	      label: 'Unschön'
	    }, {
	      value: 0,
	      label: 'Neutral'
	    }, {
	      value: -1,
	      label: 'Angenehm'
	    }, {
	      value: -2,
	      label: 'Sehr angenehm'
	    }
	  ]
	};


/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var EditTimetable, Form, Hour, React, ScheduleActions, ScheduleStore, Select, SubmitButton, TextArea, TextField, helpers, liquidFlux;
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	ScheduleStore = __webpack_require__(254);
	
	ScheduleActions = __webpack_require__(269);
	
	EditTimetable = __webpack_require__(282);
	
	Form = __webpack_require__(270);
	
	TextField = __webpack_require__(274);
	
	Select = __webpack_require__(276);
	
	Hour = __webpack_require__(277);
	
	TextArea = __webpack_require__(278);
	
	SubmitButton = __webpack_require__(279);
	
	helpers = __webpack_require__(280);
	
	module.exports = React.createClass({
	  mixins: [liquidFlux.mixin],
	  displayName: 'ScheduleEdit',
	  getFluxStates: function(props) {
	    return {
	      schedule: ScheduleStore.getSchedule(props.params.scheduleId)
	    };
	  },
	  setStoreListener: function() {
	    return [[ScheduleStore, this.refreshFluxStates]];
	  },
	  saveForm: function(values) {
	    values.id = this.state.schedule.id;
	    return ScheduleActions.update(values);
	  },
	  render: function() {
	    if (!this.state.schedule || !this.state.schedule.id) {
	      return React.createElement("div", null);
	    }
	    return React.createElement("div", {
	      "className": "content"
	    }, React.createElement("h4", {
	      "className": "header"
	    }, "Schichtplan bearbeiten ", React.createElement("a", {
	      "href": "#/" + this.props.params.event + "/" + this.state.schedule.id
	    }, "zurück")), React.createElement(Form, {
	      "className": "row",
	      "onSubmit": this.saveForm,
	      "onlyChanges": true,
	      "overlay": true
	    }, React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(TextField, {
	      "name": "title",
	      "label": "Titel",
	      "value": this.state.schedule.title,
	      "checkValue": helpers.checks.title
	    })), React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(Select, {
	      "name": "rating",
	      "label": "Bewertung",
	      "value": this.state.schedule.rating,
	      "options": helpers.ratings,
	      "checkValue": helpers.checks.rating
	    })), React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(Hour, {
	      "name": "start",
	      "label": "Beginn",
	      "value": this.state.schedule.start,
	      "checkValue": helpers.checks.start
	    })), React.createElement("div", {
	      "className": "col s12 m6"
	    }, React.createElement(Hour, {
	      "name": "end",
	      "label": "Ende",
	      "value": this.state.schedule.end,
	      "checkValue": helpers.checks.end
	    })), React.createElement("div", {
	      "className": "col s12"
	    }, React.createElement(TextArea, {
	      "name": "description",
	      "label": "Beschreibung",
	      "value": this.state.schedule.description
	    })), React.createElement("div", {
	      "className": "col s12 right-align"
	    }, React.createElement(SubmitButton, null, React.createElement("i", {
	      "className": "mdi mdi-send right"
	    }), "Speichern"))), React.createElement("p", {
	      "style": {
	        marginTop: '50px'
	      }
	    }), React.createElement(EditTimetable, {
	      "scheduleId": this.state.schedule.id,
	      "start": this.state.schedule.start,
	      "end": this.state.schedule.end
	    }));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Edit.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, Shift, ShiftActions, ShiftEditable, ShiftStore, Timetable, liquidFlux, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	liquidFlux = __webpack_require__(176);
	
	ShiftStore = __webpack_require__(283);
	
	ShiftActions = __webpack_require__(286);
	
	Timetable = __webpack_require__(287);
	
	Shift = __webpack_require__(294);
	
	ShiftEditable = __webpack_require__(297);
	
	module.exports = React.createClass({
	  mixins: [liquidFlux.mixin],
	  displayName: 'EditTimeline',
	  getFluxStates: function(props) {
	    return {
	      shifts: ShiftStore.getShiftsByScheduleId(props.scheduleId)
	    };
	  },
	  setStoreListener: function() {
	    return [[ShiftStore, this.refreshFluxStates]];
	  },
	  updateShift: function(shiftId, start, end) {
	    return ShiftActions.updateTimes(shiftId, start, end);
	  },
	  addShift: function(time) {
	    if (moment().isAfter(time)) {
	      return;
	    }
	    return ShiftActions.add(this.props.scheduleId, time.format(), time.add(2, 'h').format());
	  },
	  deleteShift: function(shiftId) {
	    return ShiftActions["delete"](shiftId);
	  },
	  render: function() {
	    var now, shift;
	    now = moment();
	    return React.createElement("div", {
	      "className": "edit"
	    }, React.createElement(Timetable, {
	      "start": this.props.start,
	      "end": this.props.end,
	      "onHourClick": this.addShift
	    }, (function() {
	      var i, len, ref, results;
	      ref = this.state.shifts;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        shift = ref[i];
	        if (shift.UserId || now.isAfter(shift.start)) {
	          results.push(React.createElement(Shift, React.__spread({}, shift, {
	            "key": shift.id,
	            "className": "disabled"
	          })));
	        } else {
	          results.push(React.createElement(ShiftEditable, React.__spread({}, shift, {
	            "key": shift.id,
	            "onUpdate": this.updateShift,
	            "onDelete": this.deleteShift,
	            "minValue": now
	          })));
	        }
	      }
	      return results;
	    }).call(this)));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "EditTimetable.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	var Queries, constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	Queries = __webpack_require__(284);
	
	constants = __webpack_require__(285);
	
	module.exports = document.sstore = liquidFlux.createStore({
	  pod: 'Shift',
	  initialise: function() {
	    this.bindAction(constants.ADD, this.doAddShift);
	    this.bindAction(constants.UPDATE, this.doUpdateShift);
	    this.bindAction(constants.DELETE, this.doDeleteShift);
	    this.bindAction(constants.SCHEDULESHIFTS_RECIEVE, this.updateScheduleShifts);
	    return this.bindAction(constants.SCHEDULESHIFTS_UPDATE, this.updateScheduleShifts);
	  },
	  getInitialState: function() {
	    return {
	      shifts: {},
	      shiftsByScheduleId: {}
	    };
	  },
	  get: {
	    shiftsByScheduleId: function(scheduleId) {
	      return this.fetch({
	        locally: function() {
	          if (!scheduleId) {
	            return [];
	          }
	          if (!this.state.shiftsByScheduleId) {
	            return;
	          }
	          return this.state.shiftsByScheduleId[scheduleId];
	        },
	        remotely: function() {
	          return Queries.getShiftsByScheduleId(scheduleId);
	        },
	        "default": []
	      });
	    }
	  },
	  "do": {
	    addShift: function(payload) {
	      return Queries.addShift(payload);
	    },
	    updateShift: function(payload) {
	      return Queries.updateShift(payload);
	    },
	    deleteShift: function(payload) {
	      return Queries.deleteShift(payload);
	    }
	  },
	  update: {
	    scheduleShifts: function(res) {
	      var i, len, ref, shift;
	      if (!res.shifts.length) {
	        return;
	      }
	      this.state.shiftsByScheduleId[res.shifts[0].scheduleId] = [];
	      ref = res.shifts;
	      for (i = 0, len = ref.length; i < len; i++) {
	        shift = ref[i];
	        this.state.shifts[shift.id] = shift;
	        this.state.shiftsByScheduleId[shift.scheduleId].push(this.state.shifts[shift.id]);
	      }
	      return this.emitChange();
	    }
	  }
	});


/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	var api, constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	api = __webpack_require__(175);
	
	constants = __webpack_require__(285);
	
	module.exports = liquidFlux.createQueries({
	  pod: 'Shift',
	  getShiftsByScheduleId: {
	    "do": function(scheduleId) {
	      return api.get("/schedule/" + scheduleId + "/shifts", this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.SCHEDULESHIFTS_RECIEVE, {
	        shifts: res
	      });
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.SCHEDULESHIFTS_UPDATE, {
	        shifts: res
	      });
	    }
	  },
	  addShift: {
	    "do": function(payload) {
	      return api.post("/schedule/" + payload.scheduleId + "/shifts", payload).then(this.success, this.error);
	    }
	  },
	  updateShift: {
	    "do": function(payload) {
	      return api.post("/shift/" + payload.id, payload).then(this.success, this.error);
	    }
	  },
	  deleteShift: {
	    "do": function(shiftId) {
	      return api["delete"]("/shift/" + shiftId, shiftId).then(this.success, this.error);
	    }
	  }
	});


/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	var liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	module.exports = liquidFlux.constants('SHIFT', ['ADD', 'UPDATE', 'DELETE', 'SCHEDULESHIFTS_RECIEVE', 'SCHEDULESHIFTS_UPDATE']);


/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	var constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	constants = __webpack_require__(285);
	
	module.exports = liquidFlux.createActions({
	  add: function(scheduleId, start, end) {
	    var payload;
	    payload = {
	      scheduleId: scheduleId,
	      start: start,
	      end: end
	    };
	    return this.dispatch(constants.ADD, payload);
	  },
	  updateTimes: function(shiftId, start, end) {
	    var payload;
	    payload = {
	      id: shiftId,
	      start: start,
	      end: end
	    };
	    return this.dispatch(constants.UPDATE, payload);
	  },
	  updateGroups: function(shiftId, groups) {
	    var payload;
	    payload = {
	      id: shiftId,
	      groups: groups
	    };
	    return this.dispatch(constants.UPDATE, payload);
	  },
	  "delete": function(shiftId) {
	    return this.dispatch(constants.DELETE, shiftId);
	  }
	});


/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var ClockLine, Events, HourGrid, React, moment;
	
	__webpack_require__(288);
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	HourGrid = __webpack_require__(290);
	
	ClockLine = __webpack_require__(292);
	
	Events = __webpack_require__(293);
	
	module.exports = React.createClass({
	  displayName: 'Timetable',
	  render: function() {
	    var end, hourHeight, start;
	    start = moment(this.props.start);
	    end = moment(this.props.end);
	    hourHeight = 24;
	    return React.createElement("div", {
	      "className": "timetable row"
	    }, React.createElement(HourGrid, {
	      "start": start,
	      "end": end,
	      "hourHeight": hourHeight,
	      "onHourClick": this.props.onHourClick
	    }), React.createElement(ClockLine, {
	      "start": start,
	      "end": end,
	      "hourHeight": hourHeight
	    }), React.createElement(Events, {
	      "start": start,
	      "end": end,
	      "hourHeight": hourHeight
	    }, this.props.children));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "index.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(289);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(289, function() {
				var newContent = __webpack_require__(289);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".timetable {\n  position: relative; }\n  .timetable .grid .line {\n    height: 24px;\n    margin-bottom: 0; }\n    .timetable .grid .line .hour {\n      text-align: right;\n      font-size: 13px;\n      margin-top: -10px;\n      opacity: 0.4; }\n      .timetable .grid .line .hour.clickable:hover {\n        opacity: 1;\n        cursor: pointer; }\n    .timetable .grid .line .lin {\n      border-top: 1px solid #fff;\n      opacity: 0.2; }\n  .timetable .grid .line.threshold .hour {\n    opacity: 0.8; }\n  .timetable .events {\n    position: absolute;\n    top: 0; }\n    .timetable .events > .row > .col {\n      padding: 0; }\n    .timetable .events .event-container {\n      position: absolute;\n      padding-right: 7px; }\n    .timetable .events .event {\n      height: 100%; }\n  .timetable .clock {\n    position: absolute;\n    width: 100%;\n    padding: 0; }\n    .timetable .clock span {\n      display: block;\n      height: 2px;\n      width: 100%;\n      background-color: #A65626;\n      margin-left: -8px; }\n", ""]);
	
	// exports


/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var HourGridLine, React, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	moment.locale('de');
	
	HourGridLine = __webpack_require__(291);
	
	module.exports = React.createClass({
	  displayName: 'HourGrid',
	  render: function() {
	    var cur, grid, i;
	    grid = [];
	    i = 0;
	    cur = moment(this.props.start);
	    while (cur.isBefore(this.props.end) || cur.isSame(this.props.end)) {
	      grid.push(React.createElement(HourGridLine, {
	        "time": moment(cur),
	        "count": i,
	        "key": i++,
	        "hourHeight": this.props.hourHeight,
	        "onHourClick": this.props.onHourClick
	      }));
	      cur.add(1, 'h');
	    }
	    return React.createElement("div", {
	      "className": "grid"
	    }, grid);
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "HourGrid.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	module.exports = React.createClass({
	  displayName: 'HourGridLine',
	  click: function(e) {
	    if (this.props.onHourClick) {
	      return this.props.onHourClick(this.props.time);
	    }
	  },
	  render: function() {
	    var dayThreshold, threshold;
	    dayThreshold = 6;
	    threshold = this.props.count === 0 || (this.props.time.hour() === dayThreshold && this.props.count > dayThreshold);
	    return React.createElement("div", {
	      "className": "line row" + (threshold ? ' threshold' : '')
	    }, React.createElement("div", {
	      "className": "hour col s2 m1" + (this.props.onHourClick ? ' clickable' : ''),
	      "onClick": this.click
	    }, (threshold ? this.props.time.format('dddd') : this.props.time.format('HH:mm'))), React.createElement("div", {
	      "className": "lin col s10 m11"
	    }));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "HourGridLine.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, intervalMixin, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	intervalMixin = {
	  intervals: [],
	  componentDidMount: function() {
	    var i, interval, len, ref, results;
	    ref = this.setIntervals();
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      interval = ref[i];
	      interval[0]();
	      results.push(this.intervals.push(setInterval(interval[0], interval[1])));
	    }
	    return results;
	  },
	  componentWillUnmount: function() {
	    var i, interval, len, ref, results;
	    ref = this.intervals;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      interval = ref[i];
	      results.push(clearInterval(interval));
	    }
	    return results;
	  }
	};
	
	module.exports = React.createClass({
	  mixins: [intervalMixin],
	  setIntervals: function() {
	    return [[this.updateClockPosition, 60000]];
	  },
	  componentDidUpdate: function() {
	    return this.updateClockPosition();
	  },
	  updateClockPosition: function() {
	    var element, min, now, top;
	    now = moment();
	    element = $(this.refs.clock);
	    if (now.isAfter(this.props.start) && now.isBefore(this.props.end)) {
	      min = now.diff(this.props.start, 'm');
	      top = min / 60 * this.props.hourHeight;
	      return element.css({
	        top: top + "px",
	        display: 'block'
	      });
	    } else {
	      return element.css({
	        top: "0px",
	        display: 'none'
	      });
	    }
	  },
	  render: function() {
	    return React.createElement("div", {
	      "ref": "clock",
	      "className": "clock col s10 m11 offset-s2 offset-m1"
	    }, React.createElement("span", null));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ClockLine.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, eventInRange, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	eventInRange = function(event, range) {
	  if ((event.start.isAfter(range.start) || event.start === range.start) && event.start.isBefore(range.end)) {
	    return true;
	  }
	  if (event.end.isAfter(range.start) && (event.end.isBefore(range.end) || event.end.isSame(range.end))) {
	    return true;
	  }
	  if ((range.start.isAfter(event.start) || range.start.isSame(event.start)) && range.start.isBefore(range.end) && (range.end.isBefore(event.end) || range.end.isSame(event.end))) {
	    return true;
	  }
	  return false;
	};
	
	module.exports = React.createClass({
	  displayName: 'Events',
	  contextTypes: {
	    getLineHeight: React.PropTypes.func
	  },
	  getEvents: function() {
	    var child, collision, curColumn, curEvent, event, events, eventsColumn, j, k, l, len, len1, len2, ref, ref1;
	    if (!this.props.children) {
	      return [];
	    }
	    events = [];
	    eventsColumn = [];
	    ref = this.props.children;
	    for (j = 0, len = ref.length; j < len; j++) {
	      child = ref[j];
	      events.push({
	        start: moment(child.props.start),
	        end: moment(child.props.end),
	        component: React.cloneElement(child, {
	          hourHeight: this.props.hourHeight,
	          gridStart: this.props.start,
	          gridEnd: this.props.end
	        })
	      });
	    }
	    events.sort(function(a, b) {
	      var aEnd, aStart, bEnd, bStart, diff, durationA, durationB;
	      aStart = a.start.unix();
	      bStart = b.start.unix();
	      aEnd = a.end.unix();
	      bEnd = b.end.unix();
	      diff = aStart - bStart;
	      if (diff !== 0) {
	        return diff;
	      }
	      durationA = aEnd - aStart;
	      durationB = bEnd - bStart;
	      return durationB - durationA;
	    });
	    for (k = 0, len1 = events.length; k < len1; k++) {
	      curEvent = events[k];
	      curColumn = 0;
	      while (true) {
	        if (!eventsColumn[curColumn]) {
	          eventsColumn[curColumn] = [];
	        }
	        collision = false;
	        ref1 = eventsColumn[curColumn];
	        for (l = 0, len2 = ref1.length; l < len2; l++) {
	          event = ref1[l];
	          if (eventInRange(curEvent, event)) {
	            collision = true;
	            break;
	          }
	        }
	        if (collision) {
	          curColumn++;
	        } else {
	          eventsColumn[curColumn].push(curEvent);
	          break;
	        }
	      }
	    }
	    return eventsColumn;
	  },
	  render: function() {
	    var c, column, columnWidth, event, events, i, style;
	    events = this.getEvents();
	    columnWidth = 100 / events.length;
	    return React.createElement("div", {
	      "className": "events col s10 m11 offset-s2 offset-m1"
	    }, React.createElement("div", {
	      "className": "row"
	    }, (function() {
	      var j, len, results;
	      results = [];
	      for (c = j = 0, len = events.length; j < len; c = ++j) {
	        column = events[c];
	        results.push(React.createElement("div", {
	          "key": c,
	          "className": "col",
	          "style": {
	            width: columnWidth + '%'
	          }
	        }, (function() {
	          var k, len1, results1;
	          results1 = [];
	          for (i = k = 0, len1 = column.length; k < len1; i = ++k) {
	            event = column[i];
	            style = {
	              top: (event.start.diff(this.props.start, 'm')) / 60 * this.props.hourHeight + 'px',
	              height: (event.end.diff(event.start, 'm')) / 60 * this.props.hourHeight + 'px',
	              width: columnWidth + '%'
	            };
	            results1.push(React.createElement("div", {
	              "key": i,
	              "className": "event-container d" + (event.end.diff(event.start, 'h')) + "h",
	              "style": style
	            }, event.component));
	          }
	          return results1;
	        }).call(this), React.createElement("div", null, " ")));
	      }
	      return results;
	    }).call(this)));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Events.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, moment;
	
	__webpack_require__(295);
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	module.exports = React.createClass({
	  displayName: 'Shift',
	  render: function() {
	    var className;
	    className = "event";
	    if (this.props.className) {
	      className += ' ' + this.props.className;
	    }
	    return React.createElement("div", {
	      "className": className,
	      "ref": "event"
	    }, React.createElement("div", {
	      "className": "time"
	    }, moment(this.props.start).format('HH:mm') + ' - ' + moment(this.props.end).format('HH:mm')), this.props.children);
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Shift.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(296);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(296, function() {
				var newContent = __webpack_require__(296);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".event {\n  height: 100%;\n  border: 1px solid #777;\n  border-radius: 2px;\n  background-color: rgba(68, 68, 68, 0.7);\n  padding: 0 2px;\n  font-size: 13px;\n  line-height: 13px; }\n  .event .time {\n    font-size: 9px;\n    opacity: 0.7; }\n  .event .buttons {\n    float: right;\n    display: none;\n    cursor: pointer; }\n    .event .buttons a {\n      padding: 2px 3px; }\n\n.d1h .event {\n  line-height: 1;\n  padding: 2px 1px;\n  font-size: 11px; }\n\n.d2h .event {\n  font-size: 12px; }\n\n.event:hover .buttons {\n  display: block; }\n\n.event.disabled {\n  background-color: #333;\n  border-color: #555;\n  background-color: rgba(51, 51, 51, 0.68); }\n\n.event.editable {\n  cursor: move; }\n  .event.editable.onEdit, .event.editable.picker-open {\n    opacity: 1;\n    z-index: 1000;\n    border-color: #fff; }\n  .event.editable::before, .event.editable::after {\n    content: ' ';\n    height: 2px;\n    display: block;\n    cursor: row-resize; }\n  .event.editable::before {\n    margin-top: -1px; }\n  .event.editable::after {\n    position: absolute;\n    display: block;\n    width: 100%;\n    bottom: -1px; }\n\n.event .picker__input {\n  margin: 0;\n  border: 0;\n  font-size: 9px;\n  height: auto;\n  width: auto;\n  display: inline; }\n", ""]);
	
	// exports


/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var GroupPicker, React, ShiftActions, ShiftCommentPicker, moment;
	
	__webpack_require__(295);
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	ShiftActions = __webpack_require__(286);
	
	GroupPicker = __webpack_require__(298);
	
	ShiftCommentPicker = __webpack_require__(306);
	
	module.exports = React.createClass({
	  displayName: 'ShiftEditable',
	  getInitialState: function() {
	    return {
	      newComment: null
	    };
	  },
	  updated: function(top, height) {
	    var end, start;
	    if (top !== null) {
	      start = moment(this.props.gridStart).add(top / this.props.hourHeight * 60, 'm');
	    } else {
	      start = moment(this.props.start);
	    }
	    end = moment(start).add(height / this.props.hourHeight * 60, 'm');
	    if (start.isSame(this.props.start) && end.isSame(this.props.end)) {
	      return;
	    }
	    return this.props.onUpdate(this.props.id, start.format(), end.format());
	  },
	  remove: function(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    return this.props.onDelete(this.props.id);
	  },
	  updateGroups: function(groupIds) {
	    return ShiftActions.updateGroups(this.props.id, groupIds);
	  },
	  updateComment: function() {
	    return this.setState({
	      newComment: this.refs.comment
	    });
	  },
	  onPickerOpen: function() {
	    return $(this.refs.event).addClass('picker-open');
	  },
	  onPickerClose: function() {
	    return $(this.refs.event).removeClass('picker-open');
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "event editable",
	      "onMouseDown": this.onMouseDown,
	      "ref": "event"
	    }, React.createElement("div", {
	      "className": "buttons"
	    }, React.createElement("a", {
	      "href": "#",
	      "onClick": this.remove
	    }, "X")), React.createElement("div", {
	      "className": "time"
	    }, moment(this.props.start).format('HH:mm') + ' - ' + moment(this.props.end).format('HH:mm')), React.createElement(GroupPicker, {
	      "multiple": true,
	      "selected": this.props.AllowedGroups,
	      "nullAreAll": true,
	      "allLabel": "Für ",
	      "prefix": "nur für ",
	      "placeholder": "Einschränken...",
	      "description": "Schicht nur für folgende Gruppen möglich",
	      "onPickerOpen": this.onPickerOpen,
	      "onPickerClose": this.onPickerClose,
	      "onUpdate": this.updateGroups
	    }), React.createElement("div", {
	      "className": "comment truncate"
	    }, (this.props.comment ? this.props.comment : void 0)));
	  },
	  snapY: function(height) {
	    return height - height % (this.props.hourHeight / 2);
	  },
	  getMinimumTop: function() {
	    var hours, minTop;
	    if (!this.props.minValue) {
	      return 0;
	    }
	    hours = this.props.minValue.diff(this.props.gridStart, 'm');
	    minTop = Math.ceil(hours / 60) * this.props.hourHeight;
	    if (minTop < 0) {
	      minTop = 0;
	    }
	    return minTop;
	  },
	  onMouseDown: function(e) {
	    var container, position;
	    e.preventDefault();
	    $(this.refs.event).addClass('onEdit');
	    container = $(this.refs.event).parent();
	    position = e.pageY - container.offset().top;
	    if (position <= 2) {
	      return this.doResizeTop(e, container);
	    } else if (position >= container.height() - 2) {
	      return this.doResizeBottom(e, container);
	    } else {
	      return this.doMove(e, container);
	    }
	  },
	  doMove: function(e, container) {
	    var body, minTop, offset;
	    minTop = this.getMinimumTop();
	    offset = e.screenY - container.position().top;
	    body = $(document.body);
	    body.css('cursor', 'move');
	    body.on('mousemove', (function(_this) {
	      return function(e) {
	        var maxHeight, y;
	        y = e.screenY - offset;
	        maxHeight = _this.props.gridEnd.diff(_this.props.gridStart, 'h') * _this.props.hourHeight;
	        if (y <= minTop) {
	          y = minTop;
	        } else if (y + container.height() > maxHeight) {
	          y = maxHeight - container.height();
	        }
	        return container.css('top', _this.snapY(y));
	      };
	    })(this));
	    return body.on('mouseup', (function(_this) {
	      return function(e) {
	        _this.release();
	        return _this.updated(_this.snapY(e.screenY - offset), container.height());
	      };
	    })(this));
	  },
	  doResizeTop: function(e, container) {
	    var body, grid, heightOffset, minTop, offset;
	    minTop = this.getMinimumTop();
	    offset = e.screenY - container.position().top;
	    heightOffset = container.position().top + container.height();
	    grid = $(document);
	    body = $(document.body);
	    $(document.body).css('cursor', 'row-resize');
	    body.on('mousemove', (function(_this) {
	      return function(e) {
	        var height, top;
	        top = _this.snapY(e.screenY - offset, 1);
	        height = _this.snapY(heightOffset - top, 1);
	        if (top >= minTop) {
	          container.css('top', top);
	          return container.css('height', height);
	        }
	      };
	    })(this));
	    return body.on('mouseup', (function(_this) {
	      return function(e) {
	        _this.release();
	        return _this.updated(_this.snapY(e.screenY - offset), container.height());
	      };
	    })(this));
	  },
	  doResizeBottom: function(e, container) {
	    var body, grid, offset;
	    offset = e.screenY - container.height();
	    grid = $(document);
	    body = $(document.body);
	    $(document.body).css('cursor', 'row-resize');
	    body.on('mousemove', (function(_this) {
	      return function(e) {
	        var height;
	        height = _this.snapY(e.screenY - offset);
	        if (height > 0) {
	          return container.css('height', height);
	        }
	      };
	    })(this));
	    return body.on('mouseup', (function(_this) {
	      return function(e) {
	        _this.release();
	        return _this.updated(null, container.height());
	      };
	    })(this));
	  },
	  release: function() {
	    var body;
	    body = $(document.body);
	    body.off('mousemove');
	    body.off('mouseup');
	    $(this.refs.event).removeClass('onEdit');
	    return body.css('cursor', '');
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ShiftEditable.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Option, Picker, React, UserStore, liquidFlux;
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	Picker = __webpack_require__(299);
	
	UserStore = __webpack_require__(302);
	
	Option = React.createClass({
	  click: function(e) {
	    return this.props.toggle(parseInt(this.props.value));
	  },
	  render: function() {
	    return React.createElement("li", {
	      "className": "",
	      "onClick": this.click
	    }, React.createElement("span", null, React.createElement("input", {
	      "type": "checkbox",
	      "checked": this.props.checked,
	      "value": this.props.value
	    }), React.createElement("label", null), this.props.label));
	  }
	});
	
	module.exports = React.createClass({
	  mixins: [liquidFlux.mixin],
	  displayName: 'GroupPicker',
	  getInitialStates: function() {
	    return {
	      selected: []
	    };
	  },
	  getFluxStates: function(props) {
	    return {
	      groups: UserStore.getGroups()
	    };
	  },
	  setStoreListener: function() {
	    return [[UserStore, this.refreshFluxStates, 'CHANGE_GROUPS']];
	  },
	  componentWillMount: function() {
	    return this.setState({
	      selected: this.props.selected
	    });
	  },
	  componentWillReceiveProps: function(nextProps) {
	    return this.setState({
	      selected: nextProps.selected
	    });
	  },
	  toggle: function(id) {
	    var g, selected;
	    selected = this.state.selected;
	    if (selected.length === 0 && this.props.nullAreAll) {
	      for (g in this.state.groups) {
	        g = parseInt(g);
	      }
	      if (g !== id) {
	        selected.push(g);
	      }
	    } else if (selected.indexOf(id) !== -1) {
	      if (selected.length > 1 || !this.props.nullAreAll) {
	        selected.splice(selected.indexOf(id), 1);
	      }
	    } else {
	      selected.push(id);
	    }
	    return this.setState({
	      selected: selected
	    });
	  },
	  setAll: function() {
	    var g, selected;
	    if (this.state.selected.length === 0) {
	      selected = this.state.selected;
	      for (g in this.state.groups) {
	        selected.push(parseInt(g));
	      }
	      return this.setState({
	        selected: selected
	      });
	    } else {
	      return this.setState({
	        selected: []
	      });
	    }
	  },
	  save: function() {
	    if (this.props.onPickerClose) {
	      this.props.onPickerClose();
	    }
	    if (this.props.onUpdate) {
	      return this.props.onUpdate(this.state.selected);
	    }
	  },
	  open: function() {
	    if (this.props.onPickerOpen) {
	      return this.props.onPickerOpen();
	    }
	  },
	  render: function() {
	    var i, id, j, label, len, name, ref;
	    if (this.state.selected.length) {
	      label = this.props.prefix;
	      ref = this.state.selected;
	      for (i = j = 0, len = ref.length; j < len; i = ++j) {
	        id = ref[i];
	        label += this.state.groups[id];
	        if (i === this.state.selected.length - 2) {
	          label += ' & ';
	        } else if (i !== this.state.selected.length - 1) {
	          label += ', ';
	        }
	      }
	    } else {
	      label = this.props.placeholder;
	    }
	    return React.createElement(Picker, {
	      "onClose": this.save,
	      "onOpen": this.open,
	      "label": label,
	      "className": this.props.className
	    }, React.createElement("div", {
	      "className": "picker__date-display"
	    }, React.createElement("div", {
	      "className": "picker__weekday-display"
	    }, "Gruppen"), React.createElement("div", {
	      "className": "picker__year-display"
	    }, React.createElement("div", null, this.props.description))), React.createElement("ul", null, (this.props.nullAreAll ? React.createElement("li", {
	      "className": "disabled",
	      "onClick": this.setAll
	    }, React.createElement("span", null, React.createElement("input", {
	      "type": "checkbox",
	      "checked": this.state.selected.length === 0
	    }), React.createElement("label", null), "Für alle")) : void 0), (function() {
	      var ref1, results;
	      ref1 = this.state.groups;
	      results = [];
	      for (id in ref1) {
	        name = ref1[id];
	        id = parseInt(id);
	        results.push(React.createElement(Option, {
	          "key": id,
	          "checked": (this.props.nullAreAll && this.state.selected.length === 0) || this.state.selected.indexOf(id) !== -1,
	          "value": id,
	          "label": name,
	          "toggle": this.toggle
	        }));
	      }
	      return results;
	    }).call(this)), React.createElement("div", {
	      "className": "picker__footer"
	    }, React.createElement("button", {
	      "className": "btn-flat picker__close",
	      "type": "button",
	      "data-close": "true"
	    }, "Fertig")));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "GroupPicker.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React;
	
	__webpack_require__(300);
	
	React = __webpack_require__(66);
	
	module.exports = React.createClass({
	  displayName: 'Picker',
	  getInitialState: function() {
	    return {
	      open: false
	    };
	  },
	  componentDidUpdate: function() {
	    var closeButtons;
	    closeButtons = $('[data-close]', this.refs.box);
	    closeButtons.off("click", this.close);
	    return closeButtons.on("click", this.close);
	  },
	  close: function() {
	    this.setState({
	      open: false
	    });
	    if (this.props.onClose) {
	      return this.props.onClose();
	    }
	  },
	  open: function() {
	    this.setState({
	      open: true
	    });
	    if (this.props.onOpen) {
	      return this.props.onOpen();
	    }
	  },
	  dont: function(e) {
	    e.preventDefault();
	    return e.stopPropagation();
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": this.props.className
	    }, React.createElement("input", {
	      "onClick": this.open,
	      "id": "test",
	      "type": "text",
	      "className": "picker__input picker__input--active truncate",
	      "value": this.props.label,
	      "readOnly": true,
	      "tabIndex": "-1"
	    }), (this.state.open || this.props.open ? React.createElement("div", {
	      "className": "picker picker--focused picker--opened",
	      "id": "test_root",
	      "tabIndex": "0",
	      "aria-hidden": "false"
	    }, React.createElement("div", {
	      "className": "picker__holder",
	      "onClick": this.close
	    }, React.createElement("div", {
	      "className": "picker__frame",
	      "onClick": this.dont
	    }, React.createElement("div", {
	      "className": "picker__wrap"
	    }, React.createElement("div", {
	      "className": "picker__box",
	      "ref": "box"
	    }, (this.props.showCloseButton ? React.createElement("button", {
	      "data-close": "true",
	      "className": "closeButton"
	    }, React.createElement("i", {
	      "className": "mdi mdi-close"
	    })) : void 0), this.props.children))))) : void 0));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Picker.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(301);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(301, function() {
				var newContent = __webpack_require__(301);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".picker__input {\n  cursor: pointer; }\n\n.picker__box li {\n  font-size: 16px;\n  color: #26a69a;\n  display: block;\n  padding: 14px 40px; }\n\n.picker__box li:hover {\n  background-color: rgba(0, 0, 0, 0.07); }\n\n.picker__box .closeButton {\n  position: absolute;\n  left: 2px;\n  color: black;\n  top: 2px;\n  opacity: 0.5;\n  border: none; }\n  .picker__box .closeButton:hover {\n    opacity: 1; }\n  .picker__box .closeButton:focus {\n    background: none; }\n\n.picker__title {\n  background-color: #1f897f;\n  color: #fff;\n  padding: 10px;\n  font-weight: 300;\n  letter-spacing: .5;\n  font-size: 1rem;\n  margin-bottom: 0;\n  text-align: center; }\n", ""]);
	
	// exports


/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	var Queries, assign, constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	Queries = __webpack_require__(303);
	
	constants = __webpack_require__(304);
	
	assign = __webpack_require__(305);
	
	module.exports = liquidFlux.createStore({
	  pod: 'User',
	  initialise: function() {
	    this.bindAction(constants.GROUPS_RECIEVE, this.updateGroups);
	    this.bindAction(constants.GROUPS_UPDATE, this.updateGroups);
	    this.bindAction(constants.USER_RECIEVE, this.updateUser);
	    this.bindAction(constants.USER_UPDATE, this.updateUser);
	    this.bindAction(constants.USERNAMES_RECIEVE, this.updateUserNames);
	    this.bindAction(constants.USERNAMES_UPDATE, this.updateUserNames);
	    this.bindAction(constants.MAILINUSE, this.updateMailInUse);
	    this.bindAction(constants.NUMBERINUSE, this.updateNumberInUse);
	    this.bindAction(constants.VERIFYSMS_SEND, this.doSendVerifySMS);
	    return this.bindAction(constants.VERIFYSMS_CHECK, this.updateVerifyCode);
	  },
	  getInitialState: function() {
	    return {
	      groups: void 0,
	      users: {},
	      userNames: void 0,
	      usedMails: {},
	      usedNumbers: {},
	      checkedCodes: {}
	    };
	  },
	  get: {
	    groups: function() {
	      return this.fetch({
	        locally: function() {
	          return this.state.groups;
	        },
	        remotely: function() {
	          return Queries.getGroups();
	        },
	        "default": {}
	      });
	    },
	    eventUser: function(id, eventId) {
	      return this.fetch({
	        locally: function() {
	          if (!id || !eventId) {
	            return null;
	          }
	          if (!this.state.users || !this.state.users[id] || !this.state.users[id].events[eventId]) {
	            return void 0;
	          }
	          return assign({
	            event: this.state.users[id].events[eventId]
	          }, this.state.users[id]);
	        },
	        remotely: function() {
	          if (true) {
	            return Queries.getEventUserExtended(id, eventId);
	          } else {
	            return Queries.getEventUser(id, eventId);
	          }
	        },
	        "default": {}
	      });
	    },
	    userNames: function() {
	      return this.fetch({
	        locally: function() {
	          return this.state.userNames;
	        },
	        remotely: function() {
	          return Queries.getUserNames();
	        },
	        "default": {}
	      });
	    }
	  },
	  is: {
	    mailInUse: function(mail) {
	      return this.fetch({
	        locally: function() {
	          return this.state.usedMails[mail];
	        },
	        remotely: function() {
	          return Queries.isMailInUse(mail);
	        },
	        "default": void 0
	      });
	    },
	    numberInUse: function(number) {
	      return this.fetch({
	        locally: function() {
	          return this.state.usedNumbers[number];
	        },
	        remotely: function() {
	          return Queries.isNumberInUse(number);
	        },
	        "default": void 0
	      });
	    },
	    correctCode: function(number, code) {
	      return this.fetch({
	        locally: function() {
	          if (this.state.checkedCodes[number]) {
	            return this.state.checkedCodes[number][code];
	          }
	        },
	        remotely: function() {
	          return Queries.checkSMSCode(number, code);
	        },
	        "default": void 0
	      });
	    }
	  },
	  update: {
	    groups: function(groups) {
	      var group, i, len;
	      this.state.groups = {};
	      for (i = 0, len = groups.length; i < len; i++) {
	        group = groups[i];
	        this.state.groups[group.id] = group.name;
	      }
	      return this.emitChange('CHANGE_GROUPS');
	    },
	    userNames: function(users) {
	      this.state.userNames = users;
	      return this.emitChange('USERNAMES');
	    },
	    user: function(user) {
	      var oldEvents;
	      if (this.state.users[user.id] && this.state.users[user.id].event) {
	        oldEvents = this.state.users[user.id].event;
	        this.state.users[user.id] = user;
	        this.state.users[user.id].events = oldEvents;
	        this.state.users[user.id].events[user.event.id] = user.event;
	      } else {
	        this.state.users[user.id] = user;
	        this.state.users[user.id].events = {};
	        this.state.users[user.id].events[user.event.id] = user.event;
	      }
	      return this.emitChange('CHANGED_USER', user);
	    },
	    mailInUse: function(res) {
	      this.state.usedMails[res.mail] = res.inUse;
	      return this.emitChange('MAILINUSE', res.mail);
	    },
	    numberInUse: function(res) {
	      this.state.usedNumbers[res.number] = res.inUse;
	      return this.emitChange('NUMBERINUSE', res.number);
	    },
	    verifyCode: function(res) {
	      if (!this.state.checkedCodes[res.number]) {
	        this.state.checkedCodes[res.number] = {};
	      }
	      this.state.checkedCodes[res.number][res.code] = res.correct;
	      return this.emitChange('SMSVERIFY', res.number);
	    }
	  },
	  "do": {
	    sendVerifySMS: function(phone) {
	      return Queries.sendVerifySMS(phone);
	    }
	  }
	});


/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	var api, constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	api = __webpack_require__(175);
	
	constants = __webpack_require__(304);
	
	module.exports = liquidFlux.createQueries({
	  pod: 'User',
	  getGroups: {
	    "do": function() {
	      return api.get("/groups", this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.GROUPS_RECIEVE, res);
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.GROUPS_UPDATE, res);
	    }
	  },
	  getEventUserExtended: {
	    "do": function(id, eventId) {
	      return api.get("/user/" + id + "/event/" + eventId + "/extended", this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.USER_RECIEVE, res);
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.USER_UPDATE, res);
	    }
	  },
	  getUserNames: {
	    "do": function() {
	      return api.get("/users/names", this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.USERNAMES_RECIEVE, res);
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.USERNAMES_UPDATE, res);
	    }
	  },
	  isMailInUse: {
	    "do": function(mail) {
	      return api.get("/register/mailcheck/" + (encodeURIComponent(mail)), this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.MAILINUSE, res);
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.MAILINUSE, res);
	    }
	  },
	  isNumberInUse: {
	    "do": function(number) {
	      return api.get("/register/numbercheck/" + (encodeURIComponent(number)), this.update).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.NUMBERINUSE, res);
	    },
	    onUpdate: function(res) {
	      return this.dispatch(constants.NUMBERINUSE, res);
	    }
	  },
	  sendVerifySMS: {
	    "do": function(phone) {
	      return api.post("/register/smsverify/" + (encodeURIComponent(phone))).then(this.success, this.error);
	    }
	  },
	  checkSMSCode: {
	    "do": function(number, code) {
	      return api.get("/register/smsverify/" + (encodeURIComponent(number)) + "/" + code).then(this.success, this.error);
	    },
	    onSuccess: function(res) {
	      return this.dispatch(constants.VERIFYSMS_CHECK, res);
	    }
	  }
	});


/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	var liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	module.exports = liquidFlux.constants('USER', ['GROUPS_RECIEVE', 'GROUPS_UPDATE', 'USER_RECIEVE', 'USER_UPDATE', 'USERNAMES_RECIEVE', 'USERNAMES_UPDATE', 'MAILINUSE', 'NUMBERINUSE', 'VERIFYSMS_SEND', 'VERIFYSMS_CHECK']);


/***/ },
/* 305 */
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
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Picker, React;
	
	React = __webpack_require__(66);
	
	Picker = __webpack_require__(299);
	
	module.exports = React.createClass({
	  displayName: 'ShiftCommentPicker',
	  getInitialState: function() {
	    return {
	      value: this.props.value
	    };
	  },
	  componentWillReceiveProps: function(nextProps) {
	    if (this.props.value === this.state.value) {
	      return this.setState({
	        value: nextProps.value
	      });
	    }
	  },
	  onClose: function() {
	    if (this.props.onClose) {
	      return this.props.onClose();
	    }
	  },
	  onOpen: function() {
	    if (this.props.onOpen) {
	      return this.props.onOpen();
	    }
	  },
	  onChange: function() {
	    return this.setState({
	      value: this.refs.comment.value
	    });
	  },
	  render: function() {
	    return React.createElement(Picker, {
	      "onClose": this.onClose,
	      "onOpen": this.onOpen,
	      "label": this.props.value
	    }, React.createElement("div", {
	      "className": "picker__date-display"
	    }, React.createElement("div", {
	      "className": "picker__weekday-display"
	    }, "Kommentar bearbeiten")), React.createElement("div", null, React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("textarea", {
	      "ref": "comment",
	      "className": "materialize-textarea",
	      "value": this.state.value,
	      "onChange": this.onChange
	    }))), React.createElement("div", {
	      "className": "picker__footer"
	    }, React.createElement("button", {
	      "className": "btn-flat picker__close",
	      "type": "button",
	      "data-close": "true"
	    }, "Fertig")));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ShiftCommentPicker.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, ScheduleStore, Shift, ShiftStore, Timetable, UserWidget, liquidFlux;
	
	React = __webpack_require__(66);
	
	Timetable = __webpack_require__(287);
	
	liquidFlux = __webpack_require__(176);
	
	UserWidget = __webpack_require__(308);
	
	ScheduleStore = __webpack_require__(254);
	
	ShiftStore = __webpack_require__(283);
	
	Shift = __webpack_require__(294);
	
	module.exports = React.createClass({
	  mixins: [liquidFlux.mixin],
	  displayName: 'ScheduleShow',
	  getFluxStates: function(props) {
	    return {
	      schedule: ScheduleStore.getSchedule(props.params.scheduleId),
	      shifts: ShiftStore.getShiftsByScheduleId(props.params.scheduleId)
	    };
	  },
	  setStoreListener: function() {
	    return [[ScheduleStore, this.refreshFluxStates], [ShiftStore, this.refreshFluxStates]];
	  },
	  render: function() {
	    var shift, t, title;
	    if (!this.state.schedule || !this.state.schedule.id) {
	      return React.createElement("div", null);
	    }
	    t = this.state.schedule.title.split('/');
	    if (t.length > 1) {
	      title = t[1];
	    } else {
	      title = t[0];
	    }
	    return React.createElement("div", {
	      "className": "content"
	    }, (true ? React.createElement("h4", {
	      "className": "header"
	    }, title, React.createElement("a", {
	      "href": "#/" + this.props.params.event + "/" + this.state.schedule.id + "/edit"
	    }, "bearbeiten")) : React.createElement("h4", {
	      "className": "header"
	    }, title)), React.createElement("p", {
	      "style": {
	        marginTop: '50px'
	      }
	    }), React.createElement(Timetable, {
	      "start": this.state.schedule.start,
	      "end": this.state.schedule.end
	    }, (function() {
	      var i, len, ref, results;
	      ref = this.state.shifts;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        shift = ref[i];
	        results.push(React.createElement(Shift, React.__spread({}, shift, {
	          "key": shift.id
	        }), React.createElement(UserWidget, {
	          "id": shift.UserId,
	          "eventId": this.state.schedule.eventId
	        }, shift.user)));
	      }
	      return results;
	    }).call(this)));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Show.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Picker, React, WidgetContent, liquidFlux;
	
	__webpack_require__(309);
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	Picker = __webpack_require__(299);
	
	WidgetContent = __webpack_require__(311);
	
	module.exports = React.createClass({
	  mixins: [liquidFlux.mixin],
	  displayName: 'UserWidget',
	  render: function() {
	    return React.createElement(Picker, {
	      "showCloseButton": true,
	      "label": this.props.children,
	      "className": "widget-user"
	    }, React.createElement(WidgetContent, {
	      "id": this.props.id,
	      "eventId": this.props.eventId
	    }));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Widget.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(310);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(310, function() {
				var newContent = __webpack_require__(310);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".widget-user .picker__frame {\n  max-width: 400px;\n  width: auto; }\n\n.widget-user .picker__box {\n  overflow: visible;\n  padding: 0 20px;\n  padding-bottom: 10px;\n  background-color: #E0E0E0; }\n\n.widget-user .profilpicture {\n  width: 150px;\n  float: right;\n  margin-top: -30px; }\n\n.widget-user .input-field {\n  padding: 5px 0; }\n  .widget-user .input-field label {\n    color: black;\n    opacity: 0.5;\n    left: 0.3rem; }\n\n.widget-user h4 a {\n  font-size: 50%; }\n\n.widget-user h5 {\n  font-weight: 200; }\n\n.widget-user .cur {\n  background-color: #26A69A;\n  height: 5px;\n  margin-top: 5px; }\n\n.widget-user .max {\n  border-bottom: 1px solid #000;\n  margin-top: -5px;\n  width: 70%; }\n  .widget-user .max:before {\n    content: ' ';\n    display: block;\n    height: 5px;\n    border-left: 1px solid #000; }\n  .widget-user .max:after {\n    content: ' ';\n    display: block;\n    height: 5px;\n    border-right: 1px solid #000;\n    float: right;\n    margin-top: -5px; }\n\n.widget-user .collection {\n  border-color: #CACACA; }\n  .widget-user .collection small {\n    color: black;\n    opacity: 0.5; }\n  .widget-user .collection span {\n    color: #484848; }\n  .widget-user .collection .title {\n    font-size: 14px; }\n  .widget-user .collection .s3 {\n    text-align: right; }\n  .widget-user .collection .collection-item {\n    padding: 5px 10px; }\n    .widget-user .collection .collection-item:hover {\n      background-color: #f5f5f5; }\n  .widget-user .collection .col {\n    padding: 0 0.5rem;\n    line-height: 1em;\n    font-size: 13px; }\n", ""]);
	
	// exports


/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, Shift, UserStore, liquidFlux;
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	UserStore = __webpack_require__(302);
	
	Shift = __webpack_require__(312);
	
	module.exports = React.createClass({
	  mixins: [liquidFlux.mixin],
	  displayName: 'UserWidgetContent',
	  getFluxStates: function(props) {
	    return {
	      user: UserStore.getEventUser(props.id, props.eventId)
	    };
	  },
	  setStoreListener: function() {
	    return [
	      [
	        UserStore, this.refreshFluxStates, 'CHANGED_USER', function(user) {
	          return user.id === this.props.eventId;
	        }
	      ]
	    ];
	  },
	  contextTypes: {
	    dayThreshold: React.PropTypes.number
	  },
	  render: function() {
	    var day, days, event, i, len, load, loadClass, name, ref, shift, shifts, start;
	    if (!this.state.user || !this.state.user.events || !this.state.user.events[this.props.eventId]) {
	      return React.createElement("div", null, "Lade... ");
	    }
	    event = this.state.user.events[this.props.eventId];
	    days = {};
	    ref = event.shifts;
	    for (i = 0, len = ref.length; i < len; i++) {
	      shift = ref[i];
	      start = moment(shift.start);
	      if (start.hour() < this.context.dayThreshold) {
	        start.subtract(1, 'd');
	      }
	      if (!days[start.format('dddd')]) {
	        days[start.format('dddd')] = [];
	      }
	      days[start.format('dddd')].push(shift);
	    }
	    return React.createElement("div", null, React.createElement("img", {
	      "src": "http://cdn0.peterkroener.de/images/peterkroener.de/profil-peter-kroener.jpg",
	      "className": "profilpicture"
	    }), React.createElement("h4", null, "Andi"), React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("div", null, this.state.user.firstname + ' ' + this.state.user.surname), React.createElement("label", {
	      "className": "active"
	    }, "Voller Name")), (event.MainPosition ? (name = event.MainPosition.name.split('/'), !name[1] ? name[1] = name[0] : void 0, React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("div", null, name[1]), React.createElement("label", {
	      "className": "active"
	    }, "Hauptposition"))) : void 0), React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("div", null, React.createElement("small", null, "von"), " ", moment(event.from).format('dddd, H'), " Uhr", React.createElement("br", null), React.createElement("small", null, "bis"), " ", moment(event.until).format('dddd, H'), " Uhr"), React.createElement("label", {
	      "className": "active"
	    }, "Anwesend")), (this.state.user.referer ? React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("div", null, this.state.user.referer), React.createElement("label", {
	      "className": "active"
	    }, "dabei über")) : void 0), (false ? (load = this.state.user.load / this.state.user.maxLoad, loadClass = 'load' + Math.round(load * 5), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s6 input-field"
	    }, React.createElement("div", null, moment(this.state.user.birthday).format('DD.MM.YYYY')), React.createElement("label", {
	      "className": "active"
	    }, "Geburtstag")), React.createElement("div", {
	      "className": "col s6 input-field"
	    }, React.createElement("div", null, React.createElement("div", {
	      "className": "cur " + loadClass,
	      "style": {
	        width: (load * 100 * 0.7) + '%'
	      }
	    }), React.createElement("div", {
	      "className": "max"
	    })), React.createElement("label", {
	      "className": "active"
	    }, "Auslastung")))) : void 0), (function() {
	      var results;
	      results = [];
	      for (day in days) {
	        shifts = days[day];
	        results.push(React.createElement("div", {
	          "key": day
	        }, React.createElement("h5", null, day), React.createElement("ul", {
	          "className": "collection shifts"
	        }, (function() {
	          var j, len1, results1;
	          results1 = [];
	          for (j = 0, len1 = shifts.length; j < len1; j++) {
	            shift = shifts[j];
	            results1.push(React.createElement(Shift, React.__spread({
	              "userId": this.props.userId
	            }, shift, {
	              "key": shift.id
	            })));
	          }
	          return results1;
	        }).call(this))));
	      }
	      return results;
	    }).call(this), (true ? React.createElement("div", null, React.createElement("h5", null, "Kontakt"), React.createElement("ul", {
	      "className": "collection"
	    }, React.createElement("li", {
	      "className": "collection-item"
	    }, React.createElement("small", null, "Email:"), " ", this.state.user.contact.email), React.createElement("li", {
	      "className": "collection-item"
	    }, React.createElement("small", null, "Telefon:"), " ", this.state.user.contact.mobile))) : void 0));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "WidgetContent.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React;
	
	React = __webpack_require__(66);
	
	module.exports = React.createClass({
	  displayName: 'UserWidgetShift',
	  render: function() {
	    var i, j, len, partner, partners, ref, schedule, start;
	    schedule = this.props.schedule.split('/');
	    if (!schedule[1]) {
	      schedule[1] = schedule[0];
	    }
	    partners = "";
	    ref = this.props.partners;
	    for (i = j = 0, len = ref.length; j < len; i = ++j) {
	      partner = ref[i];
	      partners += partner;
	      if (i === this.props.partners.length - 2) {
	        partners += ' & ';
	      } else if (i < this.props.partners.length - 2) {
	        partners += ', ';
	      }
	    }
	    start = moment(this.props.start);
	    return React.createElement("li", {
	      "className": "collection-item row"
	    }, React.createElement("div", {
	      "className": "col s8"
	    }, React.createElement("div", {
	      "className": "title"
	    }, schedule[1]), (this.props.partners.length ? React.createElement("div", null, React.createElement("small", null, "mit:"), " ", partners) : void 0)), React.createElement("div", {
	      "className": "col s3"
	    }, React.createElement("small", null, "von"), " ", start.format('HH:mm'), React.createElement("br", null), React.createElement("small", null, "bis"), " ", moment(this.props.end).format('HH:mm')), React.createElement("div", {
	      "className": "col s1"
	    }, (this.props.opened && this.props.userId !== 0 && start.isBefore(moment().subtract(1, 'h')) ? React.createElement("a", {
	      "href": "#/2016/trade/1234"
	    }, React.createElement("i", {
	      "className": "mdi mdi-repeat"
	    })) : void 0)));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "WidgetShift.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, ScheduleStore, liquidFlux, stepComponents;
	
	__webpack_require__(314);
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	ScheduleStore = __webpack_require__(254);
	
	stepComponents = [__webpack_require__(316), __webpack_require__(325), __webpack_require__(326), __webpack_require__(328), __webpack_require__(330)];
	
	module.exports = React.createClass({
	  displayName: 'Register',
	  mixins: [liquidFlux.mixin],
	  getInitialState: function() {
	    return {
	      maxStep: 5,
	      values: {
	        "name": "Jörgi",
	        "firstname": "Jörg",
	        "surname": "Petri",
	        "birthday": "1990-05-10T00:00:00+02:00",
	        "refererId": ["2"],
	        "email": "joergi@gratlerverein.de",
	        "password": "test12345",
	        "password2": "test12345",
	        "mobile": "0123456789",
	        "code": "12345",
	        "present": {
	          "start": "2016-07-29T20:00:00+02:00",
	          "end": "2016-07-31T10:00:00+02:00"
	        },
	        "favoritePartners": ["2"],
	        "favoriteSchedule": [12]
	      }
	    };
	  },
	  getFluxState: function(props) {
	    return {
	      events: ScheduleStore.getEvents()
	    };
	  },
	  setStoreListener: function() {
	    return [[ScheduleStore, this.refreshFluxStates]];
	  },
	  "continue": function(step, values) {
	    var key, newValues, value;
	    newValues = this.state.values;
	    for (key in values) {
	      value = values[key];
	      newValues[key] = value;
	    }
	    this.setState({
	      values: newValues
	    });
	    document.location.hash = '/register/' + (step + 1);
	    if (step === this.state.maxStep) {
	      return this.setState({
	        maxStep: step + 1
	      });
	    }
	  },
	  render: function() {
	    var Component, activeEvent, currentStep, event, i, max, ref, step, steps, title;
	    activeEvent = null;
	    max = 0;
	    ref = this.state.events;
	    for (title in ref) {
	      event = ref[title];
	      if (moment(event.start).unix() >= max) {
	        activeEvent = title;
	      }
	    }
	    currentStep = parseInt(this.props.params.step);
	    if (currentStep > this.state.maxStep || currentStep < 1 || !currentStep) {
	      currentStep = 1;
	    }
	    steps = ['Über dich', 'Account', 'Kontakt', 'Festival', 'Fertig'];
	    Component = stepComponents[currentStep - 1];
	    return React.createElement("div", null, React.createElement("h4", {
	      "className": "header content"
	    }, "Registrierung"), React.createElement("ul", {
	      "className": "tabs content",
	      "ref": "tabs"
	    }, (function() {
	      var j, len, results;
	      results = [];
	      for (i = j = 0, len = steps.length; j < len; i = ++j) {
	        step = steps[i];
	        if (i < this.state.maxStep) {
	          results.push(React.createElement("li", {
	            "key": i,
	            "className": "tab col s3",
	            "style": {
	              width: (100 / steps.length) + '%'
	            }
	          }, React.createElement("a", {
	            "href": "#/register/" + (i + 1),
	            "className": (i + 1 === currentStep ? 'active' : void 0)
	          }, step)));
	        } else {
	          results.push(React.createElement("li", {
	            "key": i,
	            "className": "tab col s3 disabled",
	            "style": {
	              width: (100 / steps.length) + '%'
	            }
	          }, React.createElement("a", null, step)));
	        }
	      }
	      return results;
	    }).call(this)), React.createElement(Component, React.__spread({
	      "event": activeEvent
	    }, this.state.values, {
	      "submit": this["continue"],
	      "step": currentStep
	    })));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Register.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(315);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(315, function() {
				var newContent = __webpack_require__(315);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".step-summary img {\n  width: 100%;\n  max-width: 150px;\n  border: 1px solid #AAA; }\n\n.step-summary small {\n  opacity: 0.5; }\n", ""]);
	
	// exports


/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Date, Form, ImageUpload, React, SubmitButton, TextField, UserSelect, UserStore, checks, liquidFlux, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	liquidFlux = __webpack_require__(176);
	
	Form = __webpack_require__(270);
	
	TextField = __webpack_require__(274);
	
	ImageUpload = __webpack_require__(317);
	
	Date = __webpack_require__(321);
	
	SubmitButton = __webpack_require__(279);
	
	UserStore = __webpack_require__(302);
	
	UserSelect = __webpack_require__(322);
	
	checks = __webpack_require__(324).checks;
	
	module.exports = React.createClass({
	  displayName: 'Step1',
	  mixins: [liquidFlux.mixin],
	  getFluxStates: function(props) {
	    return {
	      users: UserStore.getUserNames()
	    };
	  },
	  setStoreListener: function() {
	    return [[UserStore, this.refreshFluxStates, 'USERNAMES']];
	  },
	  submit: function(values) {
	    return this.props.submit(this.props.step, values);
	  },
	  render: function() {
	    return React.createElement(Form, {
	      "className": "content",
	      "onSubmit": this.submit
	    }, React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, React.createElement(TextField, {
	      "name": "name",
	      "label": "Dein Spitzname",
	      "value": this.props.name,
	      "checkValue": checks.name(this.state.users)
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Der Name wird im Schichtplan angezeigt"))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s6 m2 offset-m2"
	    }, React.createElement(TextField, {
	      "name": "firstname",
	      "label": "Vorname",
	      "value": this.props.firstname,
	      "checkValue": checks.required
	    })), React.createElement("div", {
	      "className": "col s6 m2"
	    }, React.createElement(TextField, {
	      "name": "surname",
	      "label": "Nachname",
	      "value": this.props.surname,
	      "checkValue": checks.required
	    }))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, React.createElement(ImageUpload, {
	      "name": "photo",
	      "label": "Foto",
	      "height": 500.,
	      "width": 400.,
	      "value": this.props.photo
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Für den Schichtplan und deinen Helferausweis", React.createElement("br", null), React.createElement("small", null, "d.h. bitte Gesicht gut erkenntlich!")))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, React.createElement(Date, {
	      "name": "birthday",
	      "label": "Geburtstag",
	      "value": this.props.birthday,
	      "checkValue": checks.birthday,
	      "min": "1950-01-01",
	      "max": "2009-12-31"
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Nicht öffentlich, nur für rechtliches Gedöns"))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, React.createElement(UserSelect, {
	      "name": "refererId",
	      "label": "Dabei über",
	      "value": this.props.refererId,
	      "nullLabel": React.createElement("small", null, "Ich = Urgestein-Gratler")
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Wie kamst du zu uns?", React.createElement("br", null), React.createElement("small", null, "Falls du schon lange dabei bist, brauchst du es nicht mehr ausfüllen")))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s6 right-align"
	    }, React.createElement(SubmitButton, null, React.createElement("i", {
	      "className": "mdi mdi-send right"
	    }), "Weiter"))));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RegisterStepInfo.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var ImageResizer, InputMixin, Picker, React;
	
	__webpack_require__(318);
	
	React = __webpack_require__(66);
	
	InputMixin = __webpack_require__(275);
	
	Picker = __webpack_require__(299);
	
	ImageResizer = __webpack_require__(320);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'ImageUpload',
	  getInitialState: function() {
	    return {
	      error: null,
	      currentImage: null,
	      pickerOpen: false,
	      fileName: null,
	      selecting: false
	    };
	  },
	  onClick: function() {
	    this.touch();
	    return this.setState({
	      selecting: true
	    });
	  },
	  onUpload: function() {
	    var file, reader;
	    file = this.refs.input.files[0];
	    if (file) {
	      reader = new FileReader();
	      reader.onloadend = (function(_this) {
	        return function() {
	          return _this.setState({
	            fileName: file.name,
	            currentImage: reader.result,
	            pickerOpen: true
	          });
	        };
	      })(this);
	      this.refs.input.value = '';
	      return reader.readAsDataURL(file);
	    }
	  },
	  openPicker: function() {
	    if (this.state.currentImage) {
	      return this.setState({
	        pickerOpen: true
	      });
	    }
	  },
	  closePicker: function() {
	    return this.setState({
	      pickerOpen: false
	    });
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "input-field image"
	    }, React.createElement("img", {
	      "src": this.getValue(),
	      "ref": "preview",
	      "className": "preview",
	      "onClick": this.openPicker
	    }), React.createElement(Picker, {
	      "open": this.state.pickerOpen,
	      "onClose": this.closePicker
	    }, React.createElement("div", {
	      "className": "picker__title"
	    }, "Foto zuschneiden"), React.createElement(ImageResizer, {
	      "source": this.state.currentImage,
	      "height": this.props.height,
	      "width": this.props.width,
	      "onChange": this.update
	    }), React.createElement("div", {
	      "className": "picker__footer"
	    }, React.createElement("button", {
	      "className": "btn-flat picker__close",
	      "type": "button",
	      "data-close": "true"
	    }, "Fertig"))), React.createElement("div", {
	      "className": "button"
	    }, React.createElement("input", {
	      "placeholder": "",
	      "id": "reactform-" + this.props.name,
	      "type": "file",
	      "onChange": this.onUpload,
	      "onClick": this.selecting,
	      "ref": "input"
	    }), React.createElement("span", {
	      "className": "truncate"
	    }, (this.state.fileName ? this.state.fileName : 'Foto auswählen...'))), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name,
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ImageUpload.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(319);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(253)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(319, function() {
				var newContent = __webpack_require__(319);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(252)();
	// imports
	
	
	// module
	exports.push([module.id, ".input-field.image .picker__input {\n  display: none; }\n\n.input-field.image img.preview {\n  height: 55px;\n  width: 45px;\n  float: left;\n  border: 1px solid white;\n  position: absolute;\n  top: -10px; }\n\n.input-field.image label {\n  margin-left: 50px;\n  transition: .2s ease-out; }\n\n.input-field.image.focus .button {\n  border-bottom: 1px solid #26a69a;\n  box-shadow: 0 1px 0 0 #26a69a; }\n\n.input-field.image.focus img.preview {\n  border-color: #26a69a; }\n\n.input-field.image.focus label {\n  color: #26a69a; }\n\n.input-field.image .button {\n  border-bottom: 1px solid #9e9e9e;\n  height: 3rem;\n  font-size: 1rem;\n  position: relative;\n  position: relative;\n  margin-left: 55px;\n  padding-top: 10px;\n  transition: .2s ease-out; }\n  .input-field.image .button span {\n    cursor: pointer; }\n  .input-field.image .button input {\n    position: absolute;\n    width: 100%;\n    height: 3rem;\n    opacity: 0;\n    cursor: pointer; }\n\n.image-resizer {\n  position: relative;\n  overflow: hidden; }\n  .image-resizer canvas {\n    display: none; }\n  .image-resizer img {\n    width: 100%; }\n  .image-resizer .box {\n    width: 100px;\n    height: 100px;\n    border: 2px dashed white;\n    position: absolute;\n    top: 0;\n    cursor: move;\n    box-shadow: 0px 0px 20px black; }\n  .image-resizer .edge {\n    height: 10px;\n    width: 10px;\n    background-color: #252525;\n    position: absolute;\n    cursor: nw-resize; }\n", ""]);
	
	// exports


/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, getOrginalWidth, startX, startY;
	
	__webpack_require__(318);
	
	React = __webpack_require__(66);
	
	startX = 0;
	
	startY = 0;
	
	getOrginalWidth = function(source, cb) {
	  var t;
	  t = $("<img/>");
	  t.attr('src', source);
	  console.log(t, t.width());
	  return t.load(function() {
	    return cb(this.width);
	  });
	};
	
	module.exports = React.createClass({
	  displayName: 'ImageResizer',
	  getInitialState: function() {
	    return {
	      height: 100,
	      width: 100,
	      x: 10,
	      y: 10,
	      orginalWidth: 0
	    };
	  },
	  componentDidMount: function() {
	    return getOrginalWidth(this.props.source, (function(_this) {
	      return function(orginalWidth) {
	        var height, img, ratio, width;
	        ratio = _this.props.height / _this.props.width;
	        img = $(_this.refs.image);
	        height = img.height();
	        width = img.width();
	        if (width * ratio > height) {
	          _this.setState({
	            height: height,
	            width: height / ratio
	          });
	        } else {
	          _this.setState({
	            height: width * ratio,
	            width: width
	          });
	        }
	        _this.setState({
	          x: 0,
	          y: 0,
	          orginalWidth: orginalWidth
	        });
	        return _this.generatePicture();
	      };
	    })(this));
	  },
	  startMove: function(e) {
	    var container, maxX, maxY, mouseup;
	    container = $(this.refs.container);
	    maxX = $(this.refs.image).width() - this.state.width;
	    maxY = $(this.refs.image).height() - this.state.height;
	    startX = e.pageX - this.state.x;
	    startY = e.pageY - this.state.y;
	    container.on('mousemove', (function(_this) {
	      return function(e) {
	        var x, y;
	        x = e.pageX - startX;
	        y = e.pageY - startY;
	        if (x > 0 && x < maxX) {
	          _this.setState({
	            x: e.pageX - startX
	          });
	        } else if (x >= maxX) {
	          startX = e.pageX - maxX;
	        } else {
	          startX = e.pageX;
	        }
	        if (y > 0 && y < maxY) {
	          return _this.setState({
	            y: e.pageY - startY
	          });
	        } else if (y >= maxY) {
	          return startY = e.pageY - maxY;
	        } else {
	          return startY = e.pageY;
	        }
	      };
	    })(this));
	    mouseup = (function(_this) {
	      return function(e) {
	        container.off('mousemove');
	        $('body').off('mouseup', mouseup);
	        return _this.generatePicture();
	      };
	    })(this);
	    return $('body').on('mouseup', mouseup);
	  },
	  startResize: function(e) {
	    var container, img, maxHeight, maxWidth, mouseup, ratio, startWidth;
	    container = $(this.refs.container);
	    ratio = this.props.height / this.props.width;
	    img = $(this.refs.image);
	    maxHeight = img.height() - this.state.y;
	    maxWidth = img.width() - this.state.x;
	    startWidth = this.state.width;
	    startX = e.pageX;
	    startY = e.pageY;
	    container.on('mousemove', (function(_this) {
	      return function(e) {
	        var newWidth, offset, offsetX, offsetY;
	        offsetX = Math.abs(e.pageX - startX);
	        offsetY = Math.abs(e.pageY - startY);
	        offset = offsetX > offsetY ? offsetX : offsetY;
	        if (e.pageX > startX || e.pageY > startY) {
	          newWidth = _this.state.width + offset;
	        } else {
	          newWidth = _this.state.width - offset;
	        }
	        if (newWidth > maxWidth) {
	          newWidth = maxWidth;
	        }
	        if (newWidth * ratio > maxHeight) {
	          newWidth = maxHeight / ratio;
	        }
	        _this.setState({
	          width: newWidth,
	          height: newWidth * ratio
	        });
	        startX = e.pageX;
	        return startY = e.pageY;
	      };
	    })(this));
	    mouseup = (function(_this) {
	      return function(e) {
	        container.off('mousemove');
	        $('body').off('mouseup', mouseup);
	        return _this.generatePicture();
	      };
	    })(this);
	    return $('body').on('mouseup', mouseup);
	  },
	  generatePicture: function() {
	    var canvas, ctx, img, ratio;
	    img = $(this.refs.image);
	    canvas = this.refs.canvas;
	    ctx = canvas.getContext("2d");
	    ratio = this.state.orginalWidth / img.width();
	    ctx.drawImage(this.refs.image, this.state.x * ratio, this.state.y * ratio, this.state.width * ratio, this.state.height * ratio, 0, 0, this.props.width, this.props.height);
	    if (this.props.onChange) {
	      return this.props.onChange(canvas.toDataURL("image/png"));
	    }
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "image-resizer",
	      "ref": "container"
	    }, React.createElement("img", {
	      "src": this.props.source,
	      "ref": "image"
	    }), React.createElement("div", {
	      "className": "box",
	      "ref": "box",
	      "onMouseDown": this.startMove,
	      "style": {
	        height: this.state.height,
	        width: this.state.width,
	        top: this.state.y,
	        left: this.state.x
	      }
	    }), React.createElement("div", {
	      "className": "edge",
	      "ref": "edge",
	      "onMouseDown": this.startResize,
	      "style": {
	        top: this.state.y + this.state.height - 5,
	        left: this.state.x + this.state.width - 5
	      }
	    }), React.createElement("canvas", {
	      "ref": "canvas",
	      "height": this.props.height,
	      "width": this.props.width
	    }));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ImageResizer.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var DropDown, InputMixin, React, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	InputMixin = __webpack_require__(275);
	
	DropDown = __webpack_require__(259);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'Date',
	  element: null,
	  componentDidMount: function() {
	    return $(this.refs.date).pickadate({
	      selectMonths: true,
	      selectYears: 70,
	      closeOnSelect: true,
	      onSet: this.changeDate,
	      monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
	      monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
	      weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
	      weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
	      today: 'Heute',
	      clear: 'Löschen',
	      close: 'Fertig',
	      firstDay: 1,
	      format: 'dddd, dd. mmmm yyyy',
	      min: this.props.min ? moment(this.props.min).toDate() : void 0,
	      max: this.props.max ? moment(this.props.max).toDate() : void 0
	    });
	  },
	  componentDidUpdate: function() {
	    return this.componentDidMount();
	  },
	  changeDate: function(e) {
	    var newDay, old;
	    this.touch();
	    old = moment(this.getValue());
	    newDay = moment.unix(e.select / 1000);
	    if (old.isValid()) {
	      newDay.hour(old.hour());
	    }
	    return this.update(newDay.format());
	  },
	  render: function() {
	    return React.createElement("div", {
	      "className": "input-field"
	    }, React.createElement("input", {
	      "id": "reactform-" + this.props.name + "-day",
	      "type": "date",
	      "className": "datepicker",
	      "ref": "date",
	      "data-value": moment(this.getValue()).format("YYYY/MM/DD"),
	      "value": moment(this.getValue()).format("dddd, D. MMM YYYY"),
	      "className": (this.state.errorText && this.isTouched() ? 'invalid' : ''),
	      "onChange": this.changeDate
	    }), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name + "-day",
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Date.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var DropDown, InputMixin, React, SelectMultiple, UserStore, liquidFlux;
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	InputMixin = __webpack_require__(275);
	
	DropDown = __webpack_require__(259);
	
	SelectMultiple = __webpack_require__(323);
	
	UserStore = __webpack_require__(302);
	
	module.exports = React.createClass({
	  displayName: 'UserPicker',
	  mixins: [liquidFlux.mixin],
	  getFluxStates: function(props) {
	    return {
	      users: UserStore.getUserNames()
	    };
	  },
	  setStoreListener: function() {
	    return [[UserStore, this.refreshFluxStates, 'USERNAMES']];
	  },
	  render: function() {
	    var id, options, ref, u;
	    if (this.props.nullLabel) {
	      options = [
	        {
	          label: this.props.nullLabel,
	          value: 0
	        }
	      ];
	    } else {
	      options = [];
	    }
	    ref = this.state.users;
	    for (id in ref) {
	      u = ref[id];
	      options.push({
	        label: u.nick,
	        searchKeys: [u.sur, u.first, u.nick],
	        value: id
	      });
	    }
	    return React.createElement(SelectMultiple, React.__spread({}, this.props, {
	      "options": options
	    }));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "UserSelect.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var DropDown, InputMixin, React;
	
	React = __webpack_require__(66);
	
	InputMixin = __webpack_require__(275);
	
	DropDown = __webpack_require__(259);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'SelectMultiple',
	  onChange: function(value) {
	    var cur;
	    cur = this.getValue() || [];
	    if (cur.indexOf(value) !== -1) {
	      cur.splice(cur.indexOf(value), 1);
	    } else {
	      cur.push(value);
	    }
	    return this.update(cur);
	  },
	  render: function() {
	    var i, j, k, label, len, len1, option, optionHash, options, v, value;
	    value = this.getValue() || [];
	    options = $.extend(true, [], this.props.options);
	    optionHash = {};
	    for (i = j = 0, len = options.length; j < len; i = ++j) {
	      option = options[i];
	      optionHash[option.value] = option;
	      options[i].selected = value.indexOf(option.value) !== -1;
	      if (options[i].selected) {
	        options[i].className = "active selected";
	      }
	    }
	    options.sort(function(a, b) {
	      if (a.selected && !b.selected) {
	        return -1;
	      }
	      if (!a.selected && b.selected) {
	        return 1;
	      }
	      return 0;
	    });
	    label = 'auswählen...';
	    if (value.length) {
	      label = '';
	      for (i = k = 0, len1 = value.length; k < len1; i = ++k) {
	        v = value[i];
	        if (optionHash[v]) {
	          label += optionHash[v].label;
	        }
	        if (i < value.length - 2) {
	          label += ', ';
	        } else if (i === value.length - 2) {
	          label += ' & ';
	        }
	      }
	    }
	    return React.createElement("div", {
	      "className": "select-wrapper input-field"
	    }, React.createElement("span", {
	      "className": "caret"
	    }, "▼"), React.createElement(DropDown, {
	      "id": "reactform-" + this.props.name,
	      "menu": options,
	      "searchable": true,
	      "onChange": this.onChange,
	      "onFocus": this.touch,
	      "className": (this.state.errorText && this.isTouched() ? 'invalid' : ''),
	      "buttonText": label
	    }), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name,
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "SelectMultiple.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	var UserStore, helpers;
	
	UserStore = __webpack_require__(302);
	
	module.exports = helpers = {
	  checks: {
	    required: function(value) {
	      if (!value || !value.trim().length) {
	        return 'Bitte angeben';
	      }
	    },
	    name: function(userList) {
	      return function(value) {
	        var id, req, u;
	        req = helpers.checks.required(value);
	        if (req) {
	          return req;
	        }
	        for (id in userList) {
	          u = userList[id];
	          if (u.nick === value) {
	            return 'Name ist bereits vergeben';
	          }
	        }
	      };
	    },
	    birthday: function(value) {
	      var v;
	      v = moment(value);
	      if (!v.isValid()) {
	        return 'Ungültig';
	      }
	      if (v.isAfter(moment())) {
	        return 'Die solltest schon geboren sein :D';
	      }
	    },
	    email: function(value) {
	      var re;
	      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	      if (!re.test(value)) {
	        return 'Ungültig';
	      }
	      if (UserStore.isMailInUse(value)) {
	        return 'Mail wird bereits verwendet';
	      }
	    },
	    password: function(value, form) {
	      if (value.length < 7 || (form.email && form.email.indexOf(value) !== -1) || parseInt(value).toString() === value) {
	        return 'zu easy!';
	      }
	    },
	    password2: function(value, form) {
	      if (value !== form.password) {
	        return 'stimmt nicht überein';
	      }
	    },
	    mobile: function(value) {
	      var part, v;
	      v = value.replace(/\s/g, '').replace('/', '');
	      if (v.substr(0, 2) === '00') {
	        v = '+' + v.substr(2);
	      }
	      part = v.substr(1);
	      if (part.length < 9 || parseInt(part).toString() !== part || (v[0] !== '+' && v[0] !== '0')) {
	        return 'Ungültig';
	      }
	      if (UserStore.isNumberInUse(value)) {
	        return 'Nummer wird bereits verwendet';
	      }
	    },
	    verifyCode: function(value, form) {
	      console.log(value, form);
	      if (value.length !== 5) {
	        return 'Ungültig';
	      }
	      if (!UserStore.isCorrectCode(form.mobile, value)) {
	        return 'Ungültig2';
	      }
	    }
	  }
	};


/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Form, React, SubmitButton, TextField, UserStore, checks, liquidFlux;
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	Form = __webpack_require__(270);
	
	TextField = __webpack_require__(274);
	
	SubmitButton = __webpack_require__(279);
	
	UserStore = __webpack_require__(302);
	
	checks = __webpack_require__(324).checks;
	
	module.exports = React.createClass({
	  displayName: 'Step2',
	  mixins: [liquidFlux.mixin],
	  setStoreListener: function() {
	    return [
	      [
	        UserStore, ((function(_this) {
	          return function() {
	            return _this.forceUpdate();
	          };
	        })(this)), 'MAILINUSE'
	      ]
	    ];
	  },
	  submit: function(values) {
	    return this.props.submit(this.props.step, values);
	  },
	  render: function() {
	    return React.createElement(Form, {
	      "className": "content",
	      "onSubmit": this.submit
	    }, React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, React.createElement(TextField, {
	      "name": "email",
	      "label": "E-Mail",
	      "value": this.props.email,
	      "checkValue": [checks.required, checks.email]
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Damit kannst du dich hier anmelden"))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s6 m2 offset-m2"
	    }, React.createElement(TextField, {
	      "name": "password",
	      "label": "Passwort",
	      "type": "password",
	      "checkValue": [checks.required, checks.password]
	    })), React.createElement("div", {
	      "className": "col s6 m2"
	    }, React.createElement(TextField, {
	      "name": "password2",
	      "type": "password",
	      "label": "...wiederholen",
	      "checkValue": [checks.required, checks.password2]
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "keine Beschwerden wenn jemand mit euren Schichten dank schlechtem Passwort Unfug treibt! :D"))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s6 right-align"
	    }, React.createElement(SubmitButton, null, React.createElement("i", {
	      "className": "mdi mdi-send right"
	    }), "Weiter"))));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RegisterStepAccount.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Form, React, SubmitButton, TextField, UserActions, UserStore, checks, liquidFlux;
	
	React = __webpack_require__(66);
	
	liquidFlux = __webpack_require__(176);
	
	Form = __webpack_require__(270);
	
	TextField = __webpack_require__(274);
	
	SubmitButton = __webpack_require__(279);
	
	UserStore = __webpack_require__(302);
	
	UserActions = __webpack_require__(327);
	
	checks = __webpack_require__(324).checks;
	
	module.exports = React.createClass({
	  displayName: 'Step3',
	  mixins: [liquidFlux.mixin],
	  getInitialState: function() {
	    return {
	      mobile: null,
	      inVerification: false
	    };
	  },
	  setStoreListener: function() {
	    return [
	      [
	        UserStore, ((function(_this) {
	          return function() {
	            return _this.forceUpdate();
	          };
	        })(this)), 'NUMBERINUSE'
	      ], [
	        UserStore, ((function(_this) {
	          return function() {
	            return _this.forceUpdate();
	          };
	        })(this)), 'SMSVERIFY'
	      ]
	    ];
	  },
	  verify: function(values) {
	    UserActions.sendVerifySMS(values.mobile);
	    return this.setState({
	      mobile: values.mobile,
	      inVerification: true
	    });
	  },
	  restart: function() {
	    return this.setState({
	      inVerification: false
	    });
	  },
	  submit: function(values) {
	    return this.props.submit(this.props.step, values);
	  },
	  render: function() {
	    if (this.state.inVerification) {
	      return React.createElement(Form, {
	        "className": "content",
	        "onSubmit": this.submit
	      }, React.createElement("div", {
	        "className": "row"
	      }, React.createElement("div", {
	        "className": "col s12 m4 offset-m2"
	      }, React.createElement(TextField, {
	        "name": "mobile",
	        "label": "Handynummer",
	        "value": this.state.mobile,
	        "disabled": true
	      })), React.createElement("div", {
	        "className": "col s12 m5"
	      }, React.createElement("blockquote", null, "Damit wir dich auch erreichen können", React.createElement("br", null), React.createElement("small", null, "Wärend dem Event kriegste auch die ein oder andere Benachrichtigung")))), React.createElement("div", {
	        "className": "row"
	      }, React.createElement("div", {
	        "className": "col s12 m4 offset-m2"
	      }, React.createElement(TextField, {
	        "name": "code",
	        "label": "Bestätigungscode",
	        "value": this.state.code,
	        "checkValue": [checks.required, checks.verifyCode]
	      })), React.createElement("div", {
	        "className": "col s12 m5"
	      }, React.createElement("blockquote", null, "Du erhältst gleich einen Code per SMS, gib den dann hier ein", React.createElement("br", null), React.createElement("b", null, "ZUM TESTEN IMMER 12345")))), React.createElement("div", {
	        "className": "row"
	      }, React.createElement("div", {
	        "className": "col s6 right-align"
	      }, React.createElement("button", {
	        "className": "waves-effect waves-light btn orange",
	        "onClick": this.restart
	      }, React.createElement("i", {
	        "className": "mdi mdi-arrow-left"
	      })), React.createElement(SubmitButton, null, React.createElement("i", {
	        "className": "mdi mdi-send right"
	      }), "Weiter"))));
	    } else {
	      return React.createElement(Form, {
	        "className": "content",
	        "onSubmit": this.verify
	      }, React.createElement("div", {
	        "className": "row"
	      }, React.createElement("div", {
	        "className": "col s12 m4 offset-m2"
	      }, React.createElement(TextField, {
	        "name": "mobile",
	        "label": "Handynummer",
	        "value": this.props.mobile,
	        "checkValue": [checks.required, checks.mobile]
	      })), React.createElement("div", {
	        "className": "col s12 m5"
	      }, React.createElement("blockquote", null, "Damit wir dich erreichen können", React.createElement("br", null), React.createElement("small", null, "Wärend dem Event kriegste auch die ein oder andere Benachrichtigung")))), React.createElement("div", {
	        "className": "row"
	      }, React.createElement("div", {
	        "className": "col s6 right-align"
	      }, React.createElement(SubmitButton, null, React.createElement("i", {
	        "className": "mdi mdi-send right"
	      }), "Bestätigen"), React.createElement(TextField, {
	        "name": "code",
	        "className": "hide"
	      }))));
	    }
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RegisterStepContact.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	var constants, liquidFlux;
	
	liquidFlux = __webpack_require__(176);
	
	constants = __webpack_require__(304);
	
	module.exports = liquidFlux.createActions({
	  sendVerifySMS: function(phone) {
	    return this.dispatch(constants.VERIFYSMS_SEND, phone);
	  }
	});


/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var Form, HourRangeSlider, React, ScheduleStore, SelectMultiple, SubmitButton, TextField, UserSelect, UserStore, checks, liquidFlux, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	liquidFlux = __webpack_require__(176);
	
	Form = __webpack_require__(270);
	
	TextField = __webpack_require__(274);
	
	SubmitButton = __webpack_require__(279);
	
	HourRangeSlider = __webpack_require__(329);
	
	SelectMultiple = __webpack_require__(323);
	
	UserStore = __webpack_require__(302);
	
	UserSelect = __webpack_require__(322);
	
	ScheduleStore = __webpack_require__(254);
	
	checks = __webpack_require__(324).checks;
	
	module.exports = React.createClass({
	  displayName: 'Step4',
	  mixins: [liquidFlux.mixin],
	  getFluxState: function(props) {
	    return {
	      event: ScheduleStore.getEvent(props.event)
	    };
	  },
	  setStoreListener: function() {
	    return [[ScheduleStore, this.refreshFluxStates]];
	  },
	  submit: function(values) {
	    return this.props.submit(this.props.step, values);
	  },
	  render: function() {
	    var scheduleOptions;
	    if (this.state.event && this.state.event.schedules) {
	      scheduleOptions = this.state.event.schedules.map(function(schedule) {
	        var keys, t, title;
	        t = schedule.title.split('/');
	        if (t.length > 1) {
	          title = t[1];
	          keys = t[1].split(' ');
	          keys.push(t[0]);
	        } else {
	          title = schedule.title;
	          keys = title.split(' ');
	        }
	        return {
	          label: title,
	          searchKeys: keys,
	          value: schedule.id
	        };
	      });
	    } else {
	      scheduleOptions = [];
	    }
	    return React.createElement(Form, {
	      "className": "content",
	      "onSubmit": this.submit
	    }, React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m8 offset-m2"
	    }, React.createElement(HourRangeSlider, {
	      "name": "present",
	      "label": "Anwesend",
	      "start": this.state.event.start,
	      "end": this.state.event.end,
	      "value": (this.props.present ? this.props.present : {
	        start: this.state.event.start,
	        end: this.state.event.end
	      }),
	      "min": 3.,
	      "format": 'ddd HH:mm'
	    }))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, React.createElement(UserSelect, {
	      "name": "favoritePartners",
	      "label": "Lieblingspartner*Innen",
	      "multiple": true,
	      "value": (this.props.favoritePartners ? this.props.favoritePartners : [])
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Mit wem würdest du gerne zusammenarbeiten?", React.createElement("br", null), React.createElement("small", null, "Noch garnicht in der Liste? kannst du auch nachträglich noch ändern!")))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s12 m4 offset-m2"
	    }, [], React.createElement(SelectMultiple, {
	      "name": "favoriteSchedule",
	      "label": "Lieblingspositionen",
	      "value": this.props.favoriteSchedule || [],
	      "options": scheduleOptions
	    })), React.createElement("div", {
	      "className": "col s12 m5"
	    }, React.createElement("blockquote", null, "Wo würdest du denn gerne arbeiten?", React.createElement("br", null), React.createElement("small", null, "Wird berücksichtigt, aber unbeliebtere Jobs muss hald auch wer machen")))), React.createElement("div", {
	      "className": "row"
	    }, React.createElement("div", {
	      "className": "col s6 right-align"
	    }, React.createElement(SubmitButton, null, React.createElement("i", {
	      "className": "mdi mdi-send right"
	    }), "Weiter"))));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RegisterStepEvents.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var InputMixin, React;
	
	React = __webpack_require__(66);
	
	InputMixin = __webpack_require__(275);
	
	module.exports = React.createClass({
	  mixins: [InputMixin],
	  displayName: 'HourRangeSlider',
	  onChange: function() {
	    return this.update(this.refs.input.value);
	  },
	  startLeftDrag: function(e) {
	    return this.startDrag('left', e);
	  },
	  startRightDrag: function(e) {
	    return this.startDrag('right', e);
	  },
	  startDrag: function(target, e) {
	    var active, body, left, moving, range, right, start, startX, width, wrapper;
	    e.preventDefault();
	    start = moment(this.props.start);
	    range = moment(this.props.end).diff(start, 'h');
	    wrapper = $(this.refs.wrapper);
	    body = $(document.body);
	    left = $(this.refs.left);
	    right = $(this.refs.right);
	    active = target === 'left' ? left : right;
	    $('.noUi-handle', active).addClass('noUi-active');
	    wrapper.addClass('noUi-state-drag');
	    width = wrapper.width();
	    startX = e.pageX - (active.offset().left - wrapper.offset().left);
	    moving = (function(_this) {
	      return function(e2) {
	        var cur, curEnd, curStart, hours, position;
	        position = e2.pageX - startX;
	        hours = Math.round(position / width * range);
	        if (target === 'left') {
	          cur = moment(start).add(hours, 'h');
	          curEnd = _this.getValue().end;
	          if (position <= width && hours >= 0) {
	            if (moment(cur).add(_this.props.min - 1, 'h').isBefore(curEnd)) {
	              return _this.update({
	                start: cur.format(),
	                end: curEnd
	              });
	            } else {
	
	            }
	          } else {
	            return _this.update({
	              start: _this.props.start,
	              end: curEnd
	            });
	          }
	        } else {
	          cur = moment(start).add(hours, 'h');
	          curStart = _this.getValue().start;
	          if (position <= width && hours >= 0) {
	            if (moment(cur).subtract(_this.props.min - 1, 'h').isAfter(curStart)) {
	              return _this.update({
	                start: curStart,
	                end: cur.format()
	              });
	            } else {
	
	            }
	          } else {
	            return _this.update({
	              start: curStart,
	              end: _this.props.end
	            });
	          }
	        }
	      };
	    })(this);
	    body.on('mousemove', moving);
	    return body.on('mouseup', function() {
	      $('.noUi-handle', active).removeClass('noUi-active');
	      wrapper.removeClass('noUi-state-drag');
	      return body.off('mousemove', moving);
	    });
	  },
	  render: function() {
	    var end, left, range, rangeStart, right, start;
	    rangeStart = moment(this.props.start);
	    range = moment(this.props.end).diff(rangeStart, 'h');
	    start = moment(this.getValue().start);
	    end = moment(this.getValue().end);
	    left = start.diff(rangeStart, 'h') / range;
	    right = end.diff(rangeStart, 'h') / range;
	    return React.createElement("div", {
	      "className": "input-field range-slider"
	    }, React.createElement("div", {
	      "ref": "wrapper",
	      "className": "noUi-target noUi-ltr noUi-horizontal noUi-background"
	    }, React.createElement("div", {
	      "className": "noUi-base"
	    }, React.createElement("div", {
	      "ref": "left",
	      "className": "noUi-origin noUi-connect",
	      "style": {
	        left: (left * 100) + '%'
	      }
	    }, React.createElement("div", {
	      "onMouseDown": this.startLeftDrag,
	      "className": "noUi-handle noUi-handle-lower"
	    })), React.createElement("div", {
	      "ref": "right",
	      "className": "noUi-origin noUi-background",
	      "style": {
	        left: (right * 100) + '%'
	      }
	    }, React.createElement("div", {
	      "onMouseDown": this.startRightDrag,
	      "className": "noUi-handle noUi-handle-upper"
	    })))), React.createElement("div", {
	      "className": "current"
	    }, React.createElement("div", {
	      "style": {
	        float: 'right'
	      }
	    }, React.createElement("small", null, "Bis:"), " ", end.format(this.props.format)), React.createElement("div", null, React.createElement("small", null, "Von:"), " ", start.format(this.props.format))), React.createElement("label", {
	      "htmlFor": "reactform-" + this.props.name,
	      "data-error": this.state.errorText,
	      "className": "active"
	    }, this.props.label));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "HourRangeSlider.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(3), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(13), React = __webpack_require__(66); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	var React, ScheduleStore, UserSelect, UserStore, liquidFlux, moment;
	
	React = __webpack_require__(66);
	
	moment = __webpack_require__(180);
	
	liquidFlux = __webpack_require__(176);
	
	UserStore = __webpack_require__(302);
	
	UserSelect = __webpack_require__(322);
	
	ScheduleStore = __webpack_require__(254);
	
	module.exports = React.createClass({
	  displayName: 'Summary',
	  mixins: [liquidFlux.mixin],
	  getFluxStates: function(props) {
	    return {
	      users: UserStore.getUserNames(),
	      event: ScheduleStore.getEvent(props.event)
	    };
	  },
	  setStoreListener: function() {
	    return [[UserStore, this.refreshFluxStates, 'USERNAMES'], [ScheduleStore, this.refreshFluxStates]];
	  },
	  render: function() {
	    var referer;
	    if (this.state.users[this.props.refererId]) {
	      referer = this.state.users[this.props.refererId].nick;
	    }
	    return React.createElement("div", {
	      "className": "row content step-summary"
	    }, React.createElement("div", {
	      "className": "col s12 m3 offset-m2"
	    }, React.createElement("img", {
	      "src": this.props.photo
	    })), React.createElement("div", {
	      "className": "col s12 m7"
	    }, React.createElement("h3", {
	      "className": "header"
	    }, "Zusammenfassung"), React.createElement("div", null, React.createElement("small", null, "Du bist"), " ", this.props.firstname, " ", React.createElement("b", null, "\'", this.props.name, "\'"), " ", this.props.surname), React.createElement("div", null, React.createElement("small", null, "geboren am"), " ", moment(this.props.birthday).format('DD. MMMM YYYY')), (referer ? React.createElement("div", null, React.createElement("small", null, "dabei bist du über"), " ", referer) : void 0), React.createElement("blockquote", null, "Stimmt denn alles?", React.createElement("br", null), React.createElement("small", null, "mit den Reitern oben kannst du nochmal zurück")), React.createElement("button", {
	      "className": "btn"
	    }, "Abschicken")));
	  }
	});
	

	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(262); if (makeExportsHot(module, __webpack_require__(66))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RegisterStepSummary.cjsx" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {var url = __webpack_require__(332);
	var SockJS = __webpack_require__(337);
	var stripAnsi = __webpack_require__(400);
	var scriptElements = document.getElementsByTagName("script");
	
	var urlParts = url.parse( true ?
		__resourceQuery.substr(1) :
		scriptElements[scriptElements.length-1].getAttribute("src").replace(/\/[^\/]+$/, "")
	);
	
	var sock = null;
	var hot = false;
	var initial = true;
	var currentHash = "";
	
	var onSocketMsg = {
		hot: function() {
			hot = true;
			console.log("[WDS] Hot Module Replacement enabled.");
		},
		invalid: function() {
			console.log("[WDS] App updated. Recompiling...");
		},
		hash: function(hash) {
			currentHash = hash;
		},
		"still-ok": function() {
			console.log("[WDS] Nothing changed.")
		},
		ok: function() {
			if(initial) return initial = false;
			reloadApp();
		},
		warnings: function(warnings) {
			console.log("[WDS] Warnings while compiling.");
			for(var i = 0; i < warnings.length; i++)
				console.warn(stripAnsi(warnings[i]));
			if(initial) return initial = false;
			reloadApp();
		},
		errors: function(errors) {
			console.log("[WDS] Errors while compiling.");
			for(var i = 0; i < errors.length; i++)
				console.error(stripAnsi(errors[i]));
			if(initial) return initial = false;
			reloadApp();
		},
		"proxy-error": function(errors) {
			console.log("[WDS] Proxy error.");
			for(var i = 0; i < errors.length; i++)
				console.error(stripAnsi(errors[i]));
			if(initial) return initial = false;
			reloadApp();
		}
	};
	
	var newConnection = function() {
		sock = new SockJS(url.format({
			protocol: urlParts.protocol,
			auth: urlParts.auth,
			hostname: (urlParts.hostname === '0.0.0.0') ? window.location.hostname : urlParts.hostname,
			port: urlParts.port,
			pathname: urlParts.path === '/' ? "/sockjs-node" : urlParts.path
		}));
	
		sock.onclose = function() {
			console.error("[WDS] Disconnected!");
	
			// Try to reconnect.
			sock = null;
			setTimeout(function () {
				newConnection();
			}, 2000);
		};
	
		sock.onmessage = function(e) {
			// This assumes that all data sent via the websocket is JSON.
			var msg = JSON.parse(e.data);
			onSocketMsg[msg.type](msg.data);
		};
	};
	
	newConnection();
	
	function reloadApp() {
		if(hot) {
			console.log("[WDS] App hot update...");
			window.postMessage("webpackHotUpdate" + currentHash, "*");
		} else {
			console.log("[WDS] App updated. Reloading...");
			window.location.reload();
		}
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:8080"))

/***/ },
/* 332 */
/***/ function(module, exports, __webpack_require__) {

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
	
	var punycode = __webpack_require__(333);
	
	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;
	
	exports.Url = Url;
	
	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}
	
	// Reference: RFC 3986, RFC 1808, RFC 2396
	
	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,
	
	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
	
	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
	
	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(334);
	
	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;
	
	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}
	
	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }
	
	  var rest = url;
	
	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();
	
	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }
	
	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }
	
	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {
	
	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c
	
	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.
	
	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	
	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }
	
	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }
	
	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;
	
	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);
	
	    // pull out port.
	    this.parseHost();
	
	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';
	
	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';
	
	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }
	
	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }
	
	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }
	
	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;
	
	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }
	
	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {
	
	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }
	
	
	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }
	
	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }
	
	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};
	
	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}
	
	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }
	
	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';
	
	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }
	
	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }
	
	  var search = this.search || (query && ('?' + query)) || '';
	
	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';
	
	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }
	
	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;
	
	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');
	
	  return protocol + host + pathname + search + hash;
	};
	
	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}
	
	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};
	
	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}
	
	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }
	
	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);
	
	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;
	
	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }
	
	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });
	
	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }
	
	    result.href = result.format();
	    return result;
	  }
	
	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }
	
	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }
	
	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];
	
	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }
	
	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');
	
	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }
	
	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }
	
	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }
	
	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');
	
	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }
	
	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);
	
	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }
	
	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }
	
	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};
	
	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};
	
	function isString(arg) {
	  return typeof arg === "string";
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {
	
		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}
	
		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,
	
		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
	
		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'
	
		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
	
		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},
	
		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,
	
		/** Temporary variable */
		key;
	
		/*--------------------------------------------------------------------------*/
	
		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}
	
		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}
	
		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}
	
		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}
	
		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}
	
		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}
	
		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}
	
		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;
	
			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.
	
			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}
	
			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}
	
			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.
	
			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
	
				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
	
					if (index >= inputLength) {
						error('invalid-input');
					}
	
					digit = basicToDigit(input.charCodeAt(index++));
	
					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}
	
					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	
					if (digit < t) {
						break;
					}
	
					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}
	
					w *= baseMinusT;
	
				}
	
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);
	
				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}
	
				n += floor(i / out);
				i %= out;
	
				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);
	
			}
	
			return ucs2encode(output);
		}
	
		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;
	
			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);
	
			// Cache the length
			inputLength = input.length;
	
			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;
	
			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}
	
			handledCPCount = basicLength = output.length;
	
			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.
	
			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}
	
			// Main encoding loop:
			while (handledCPCount < inputLength) {
	
				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}
	
				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}
	
				delta += (m - n) * handledCPCountPlusOne;
				n = m;
	
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
	
					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}
	
					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}
	
						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}
	
				++delta;
				++n;
	
			}
			return output.join('');
		}
	
		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}
	
		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}
	
		/*--------------------------------------------------------------------------*/
	
		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};
	
		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 334 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(335);
	exports.encode = exports.stringify = __webpack_require__(336);


/***/ },
/* 335 */
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
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};


/***/ },
/* 336 */
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
	
	'use strict';
	
	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var transportList = __webpack_require__(338);
	
	module.exports = __webpack_require__(384)(transportList);
	
	// TODO can't get rid of this until all servers do
	if ('_sockjs_onload' in global) {
	  setTimeout(global._sockjs_onload, 1);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = [
	  // streaming transports
	  __webpack_require__(339)
	, __webpack_require__(355)
	, __webpack_require__(365)
	, __webpack_require__(367)
	, __webpack_require__(370)(__webpack_require__(367))
	
	  // polling transports
	, __webpack_require__(377)
	, __webpack_require__(370)(__webpack_require__(377))
	, __webpack_require__(379)
	, __webpack_require__(380)
	, __webpack_require__(370)(__webpack_require__(379))
	, __webpack_require__(381)
	];


/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(340)
	  , urlUtils = __webpack_require__(343)
	  , inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  , WebsocketDriver = __webpack_require__(354)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:websocket');
	}
	
	function WebSocketTransport(transUrl) {
	  if (!WebSocketTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	
	  EventEmitter.call(this);
	  debug('constructor', transUrl);
	
	  var self = this;
	  var url = urlUtils.addPath(transUrl, '/websocket');
	  if (url.slice(0, 5) === 'https') {
	    url = 'wss' + url.slice(5);
	  } else {
	    url = 'ws' + url.slice(4);
	  }
	  this.url = url;
	
	  this.ws = new WebsocketDriver(this.url);
	  this.ws.onmessage = function(e) {
	    debug('message event', e.data);
	    self.emit('message', e.data);
	  };
	  // Firefox has an interesting bug. If a websocket connection is
	  // created after onunload, it stays alive even when user
	  // navigates away from the page. In such situation let's lie -
	  // let's not open the ws connection at all. See:
	  // https://github.com/sockjs/sockjs-client/issues/28
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
	  this.unloadRef = utils.unloadAdd(function() {
	    debug('unload');
	    self.ws.close();
	  });
	  this.ws.onclose = function(e) {
	    debug('close event', e.code, e.reason);
	    self.emit('close', e.code, e.reason);
	    self._cleanup();
	  };
	  this.ws.onerror = function(e) {
	    debug('error event', e);
	    self.emit('close', 1006, 'WebSocket connection broken');
	    self._cleanup();
	  };
	}
	
	inherits(WebSocketTransport, EventEmitter);
	
	WebSocketTransport.prototype.send = function(data) {
	  var msg = '[' + data + ']';
	  debug('send', msg);
	  this.ws.send(msg);
	};
	
	WebSocketTransport.prototype.close = function() {
	  debug('close');
	  if (this.ws) {
	    this.ws.close();
	  }
	  this._cleanup();
	};
	
	WebSocketTransport.prototype._cleanup = function() {
	  debug('_cleanup');
	  var ws = this.ws;
	  if (ws) {
	    ws.onmessage = ws.onclose = ws.onerror = null;
	  }
	  utils.unloadDel(this.unloadRef);
	  this.unloadRef = this.ws = null;
	  this.removeAllListeners();
	};
	
	WebSocketTransport.enabled = function() {
	  debug('enabled');
	  return !!WebsocketDriver;
	};
	WebSocketTransport.transportName = 'websocket';
	
	// In theory, ws should require 1 round trip. But in chrome, this is
	// not very stable over SSL. Most likely a ws connection requires a
	// separate SSL connection, in which case 2 round trips are an
	// absolute minumum.
	WebSocketTransport.roundTrips = 2;
	
	module.exports = WebSocketTransport;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 340 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var random = __webpack_require__(341);
	
	var onUnload = {}
	  , afterUnload = false
	    // detect google chrome packaged apps because they don't allow the 'unload' event
	  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
	  ;
	
	module.exports = {
	  attachEvent: function(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.addEventListener(event, listener, false);
	    } else if (global.document && global.attachEvent) {
	      // IE quirks.
	      // According to: http://stevesouders.com/misc/test-postmessage.php
	      // the message gets delivered only to 'document', not 'window'.
	      global.document.attachEvent('on' + event, listener);
	      // I get 'window' for ie8.
	      global.attachEvent('on' + event, listener);
	    }
	  }
	
	, detachEvent: function(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.removeEventListener(event, listener, false);
	    } else if (global.document && global.detachEvent) {
	      global.document.detachEvent('on' + event, listener);
	      global.detachEvent('on' + event, listener);
	    }
	  }
	
	, unloadAdd: function(listener) {
	    if (isChromePackagedApp) {
	      return null;
	    }
	
	    var ref = random.string(8);
	    onUnload[ref] = listener;
	    if (afterUnload) {
	      setTimeout(this.triggerUnloadCallbacks, 0);
	    }
	    return ref;
	  }
	
	, unloadDel: function(ref) {
	    if (ref in onUnload) {
	      delete onUnload[ref];
	    }
	  }
	
	, triggerUnloadCallbacks: function() {
	    for (var ref in onUnload) {
	      onUnload[ref]();
	      delete onUnload[ref];
	    }
	  }
	};
	
	var unloadTriggered = function() {
	  if (afterUnload) {
	    return;
	  }
	  afterUnload = true;
	  module.exports.triggerUnloadCallbacks();
	};
	
	// 'unload' alone is not reliable in opera within an iframe, but we
	// can't use `beforeunload` as IE fires it on javascript: links.
	if (!isChromePackagedApp) {
	  module.exports.attachEvent('unload', unloadTriggered);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global crypto:true */
	var crypto = __webpack_require__(342);
	
	// This string has length 32, a power of 2, so the modulus doesn't introduce a
	// bias.
	var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
	module.exports = {
	  string: function(length) {
	    var max = _randomStringChars.length;
	    var bytes = crypto.randomBytes(length);
	    var ret = [];
	    for (var i = 0; i < length; i++) {
	      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
	    }
	    return ret.join('');
	  }
	
	, number: function(max) {
	    return Math.floor(Math.random() * max);
	  }
	
	, numberString: function(max) {
	    var t = ('' + (max - 1)).length;
	    var p = new Array(t + 1).join('0');
	    return (p + this.number(max)).slice(-t);
	  }
	};


/***/ },
/* 342 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	if (global.crypto && global.crypto.getRandomValues) {
	  module.exports.randomBytes = function(length) {
	    var bytes = new Uint8Array(length);
	    global.crypto.getRandomValues(bytes);
	    return bytes;
	  };
	} else {
	  module.exports.randomBytes = function(length) {
	    var bytes = new Array(length);
	    for (var i = 0; i < length; i++) {
	      bytes[i] = Math.floor(Math.random() * 256);
	    }
	    return bytes;
	  };
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var URL = __webpack_require__(344);
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:utils:url');
	}
	
	module.exports = {
	  getOrigin: function(url) {
	    if (!url) {
	      return null;
	    }
	
	    var p = new URL(url);
	    if (p.protocol === 'file:') {
	      return null;
	    }
	
	    var port = p.port;
	    if (!port) {
	      port = (p.protocol === 'https:') ? '443' : '80';
	    }
	
	    return p.protocol + '//' + p.hostname + ':' + port;
	  }
	
	, isOriginEqual: function(a, b) {
	    var res = this.getOrigin(a) === this.getOrigin(b);
	    debug('same', a, b, res);
	    return res;
	  }
	
	, isSchemeEqual: function(a, b) {
	    return (a.split(':')[0] === b.split(':')[0]);
	  }
	
	, addPath: function (url, path) {
	    var qs = url.split('?');
	    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
	  }
	
	, addQuery: function (url, q) {
	    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 344 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var required = __webpack_require__(345)
	  , lolcation = __webpack_require__(346)
	  , qs = __webpack_require__(347)
	  , relativere = /^\/(?!\/)/;
	
	/**
	 * These are the parse instructions for the URL parsers, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var instructions = [
	  ['#', 'hash'],                        // Extract from the back.
	  ['?', 'query'],                       // Extract from the back.
	  ['//', 'protocol', 2, 1, 1],          // Extract from the front.
	  ['/', 'pathname'],                    // Extract from the back.
	  ['@', 'auth', 1],                     // Extract from the front.
	  [NaN, 'host', undefined, 1, 1],       // Set left over value.
	  [/\:(\d+)$/, 'port'],                 // RegExp the back.
	  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
	];
	
	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my CDO.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Boolean|function} parser Parser for the query string.
	 * @param {Object} location Location defaults for relative paths.
	 * @api public
	 */
	function URL(address, location, parser) {
	  if (!(this instanceof URL)) {
	    return new URL(address, location, parser);
	  }
	
	  var relative = relativere.test(address)
	    , parse, instruction, index, key
	    , type = typeof location
	    , url = this
	    , i = 0;
	
	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }
	
	  if (parser && 'function' !== typeof parser) {
	    parser = qs.parse;
	  }
	
	  location = lolcation(location);
	
	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];
	    parse = instruction[0];
	    key = instruction[1];
	
	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if (index = parse.exec(address)) {
	      url[key] = index[1];
	      address = address.slice(0, address.length - index[0].length);
	    }
	
	    url[key] = url[key] || (instruction[3] || ('port' === key && relative) ? location[key] || '' : '');
	
	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) {
	      url[key] = url[key].toLowerCase();
	    }
	  }
	
	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);
	
	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }
	
	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }
	
	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}
	
	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} prop Property we need to adjust.
	 * @param {Mixed} value The newly assigned value.
	 * @returns {URL}
	 * @api public
	 */
	URL.prototype.set = function set(part, value, fn) {
	  var url = this;
	
	  if ('query' === part) {
	    if ('string' === typeof value && value.length) {
	      value = (fn || qs.parse)(value);
	    }
	
	    url[part] = value;
	  } else if ('port' === part) {
	    url[part] = value;
	
	    if (!required(value, url.protocol)) {
	      url.host = url.hostname;
	      url[part] = '';
	    } else if (value) {
	      url.host = url.hostname +':'+ value;
	    }
	  } else if ('hostname' === part) {
	    url[part] = value;
	
	    if (url.port) value += ':'+ url.port;
	    url.host = value;
	  } else if ('host' === part) {
	    url[part] = value;
	
	    if (/\:\d+/.test(value)) {
	      value = value.split(':');
	      url.hostname = value[0];
	      url.port = value[1];
	    }
	  } else {
	    url[part] = value;
	  }
	
	  url.href = url.toString();
	  return url;
	};
	
	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String}
	 * @api public
	 */
	URL.prototype.toString = function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;
	
	  var query
	    , url = this
	    , result = url.protocol +'//';
	
	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':'+ url.password;
	    result += '@';
	  }
	
	  result += url.hostname;
	  if (url.port) result += ':'+ url.port;
	
	  result += url.pathname;
	
	  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;
	
	  if (url.hash) result += url.hash;
	
	  return result;
	};
	
	//
	// Expose the URL parser and some additional properties that might be useful for
	// others.
	//
	URL.qs = qs;
	URL.location = lolcation;
	module.exports = URL;


/***/ },
/* 345 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */
	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;
	
	  if (!port) return false;
	
	  switch (protocol) {
	    case 'http':
	    case 'ws':
	    return port !== 80;
	
	    case 'https':
	    case 'wss':
	    return port !== 443;
	
	    case 'ftp':
	    return port !== 21;
	
	    case 'gopher':
	    return port !== 70;
	
	    case 'file':
	    return false;
	  }
	
	  return port !== 0;
	};


/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as the a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 }
	  , URL;
	
	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @api public
	 */
	module.exports = function lolcation(loc) {
	  loc = loc || global.location || {};
	  URL = URL || __webpack_require__(344);
	
	  var finaldestination = {}
	    , type = typeof loc
	    , key;
	
	  if ('blob:' === loc.protocol) {
	    finaldestination = new URL(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new URL(loc, {});
	    for (key in ignore) delete finaldestination[key];
	  } else if ('object' === type) for (key in loc) {
	    if (key in ignore) continue;
	    finaldestination[key] = loc[key];
	  }
	
	  return finaldestination;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 347 */
/***/ function(module, exports) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=([^&]*)/g
	    , result = {}
	    , part;
	
	  //
	  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
	  // the lastIndex property so we can continue executing this loop until we've
	  // parsed all results.
	  //
	  for (;
	    part = parser.exec(query);
	    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
	  );
	
	  return result;
	}
	
	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';
	
	  var pairs = [];
	
	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';
	
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
	    }
	  }
	
	  return pairs.length ? prefix + pairs.join('&') : '';
	}
	
	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;


/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(349);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(350);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 350 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 351 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 352 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , EventTarget = __webpack_require__(353)
	  ;
	
	function EventEmitter() {
	  EventTarget.call(this);
	}
	
	inherits(EventEmitter, EventTarget);
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  if (type) {
	    delete this._listeners[type];
	  } else {
	    this._listeners = {};
	  }
	};
	
	EventEmitter.prototype.once = function(type, listener) {
	  var self = this
	    , fired = false;
	
	  function g() {
	    self.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  this.on(type, g);
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var listeners = this._listeners[type];
	  if (!listeners) {
	    return;
	  }
	  var args = Array.prototype.slice.call(arguments, 1);
	  for (var i = 0; i < listeners.length; i++) {
	    listeners[i].apply(this, args);
	  }
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
	EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;
	
	module.exports.EventEmitter = EventEmitter;


/***/ },
/* 353 */
/***/ function(module, exports) {

	'use strict';
	
	/* Simplified implementation of DOM2 EventTarget.
	 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
	 */
	
	function EventTarget() {
	  this._listeners = {};
	}
	
	EventTarget.prototype.addEventListener = function(eventType, listener) {
	  if (!(eventType in this._listeners)) {
	    this._listeners[eventType] = [];
	  }
	  var arr = this._listeners[eventType];
	  // #4
	  if (arr.indexOf(listener) === -1) {
	    // Make a copy so as not to interfere with a current dispatchEvent.
	    arr = arr.concat([listener]);
	  }
	  this._listeners[eventType] = arr;
	};
	
	EventTarget.prototype.removeEventListener = function(eventType, listener) {
	  var arr = this._listeners[eventType];
	  if (!arr) {
	    return;
	  }
	  var idx = arr.indexOf(listener);
	  if (idx !== -1) {
	    if (arr.length > 1) {
	      // Make a copy so as not to interfere with a current dispatchEvent.
	      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
	    } else {
	      delete this._listeners[eventType];
	    }
	    return;
	  }
	};
	
	EventTarget.prototype.dispatchEvent = function(event) {
	  var t = event.type;
	  var args = Array.prototype.slice.call(arguments, 0);
	  // TODO: This doesn't match the real behavior; per spec, onfoo get
	  // their place in line from the /first/ time they're set from
	  // non-null. Although WebKit bumps it to the end every time it's
	  // set.
	  if (this['on' + t]) {
	    this['on' + t].apply(this, args);
	  }
	  if (t in this._listeners) {
	    // Grab a reference to the listeners list. removeEventListener may alter the list.
	    var listeners = this._listeners[t];
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i].apply(this, args);
	    }
	  }
	};
	
	module.exports = EventTarget;


/***/ },
/* 354 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.WebSocket || global.MozWebSocket;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 355 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , AjaxBasedTransport = __webpack_require__(356)
	  , XhrReceiver = __webpack_require__(360)
	  , XHRCorsObject = __webpack_require__(361)
	  , XHRLocalObject = __webpack_require__(363)
	  , browser = __webpack_require__(364)
	  ;
	
	function XhrStreamingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
	}
	
	inherits(XhrStreamingTransport, AjaxBasedTransport);
	
	XhrStreamingTransport.enabled = function(info) {
	  if (info.nullOrigin) {
	    return false;
	  }
	  // Opera doesn't support xhr-streaming #60
	  // But it might be able to #92
	  if (browser.isOpera()) {
	    return false;
	  }
	
	  return XHRCorsObject.enabled;
	};
	
	XhrStreamingTransport.transportName = 'xhr-streaming';
	XhrStreamingTransport.roundTrips = 2; // preflight, ajax
	
	// Safari gets confused when a streaming ajax request is started
	// before onload. This causes the load indicator to spin indefinetely.
	// Only require body when used in a browser
	XhrStreamingTransport.needBody = !!global.document;
	
	module.exports = XhrStreamingTransport;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , urlUtils = __webpack_require__(343)
	  , SenderReceiver = __webpack_require__(357)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:ajax-based');
	}
	
	function createAjaxSender(AjaxObject) {
	  return function(url, payload, callback) {
	    debug('create ajax sender', url, payload);
	    var opt = {};
	    if (typeof payload === 'string') {
	      opt.headers = {'Content-type':'text/plain'};
	    }
	    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
	    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
	    xo.once('finish', function(status) {
	      debug('finish', status);
	      xo = null;
	
	      if (status !== 200 && status !== 204) {
	        return callback(new Error('http status ' + status));
	      }
	      callback();
	    });
	    return function() {
	      debug('abort');
	      xo.close();
	      xo = null;
	
	      var err = new Error('Aborted');
	      err.code = 1000;
	      callback(err);
	    };
	  };
	}
	
	function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
	  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
	}
	
	inherits(AjaxBasedTransport, SenderReceiver);
	
	module.exports = AjaxBasedTransport;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , urlUtils = __webpack_require__(343)
	  , BufferedSender = __webpack_require__(358)
	  , Polling = __webpack_require__(359)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:sender-receiver');
	}
	
	function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
	  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
	  debug(pollUrl);
	  var self = this;
	  BufferedSender.call(this, transUrl, senderFunc);
	
	  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
	  this.poll.on('message', function(msg) {
	    debug('poll message', msg);
	    self.emit('message', msg);
	  });
	  this.poll.once('close', function(code, reason) {
	    debug('poll close', code, reason);
	    self.poll = null;
	    self.emit('close', code, reason);
	    self.close();
	  });
	}
	
	inherits(SenderReceiver, BufferedSender);
	
	SenderReceiver.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  if (this.poll) {
	    this.poll.abort();
	    this.poll = null;
	  }
	  this.stop();
	};
	
	module.exports = SenderReceiver;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:buffered-sender');
	}
	
	function BufferedSender(url, sender) {
	  debug(url);
	  EventEmitter.call(this);
	  this.sendBuffer = [];
	  this.sender = sender;
	  this.url = url;
	}
	
	inherits(BufferedSender, EventEmitter);
	
	BufferedSender.prototype.send = function(message) {
	  debug('send', message);
	  this.sendBuffer.push(message);
	  if (!this.sendStop) {
	    this.sendSchedule();
	  }
	};
	
	// For polling transports in a situation when in the message callback,
	// new message is being send. If the sending connection was started
	// before receiving one, it is possible to saturate the network and
	// timeout due to the lack of receiving socket. To avoid that we delay
	// sending messages by some small time, in order to let receiving
	// connection be started beforehand. This is only a halfmeasure and
	// does not fix the big problem, but it does make the tests go more
	// stable on slow networks.
	BufferedSender.prototype.sendScheduleWait = function() {
	  debug('sendScheduleWait');
	  var self = this;
	  var tref;
	  this.sendStop = function() {
	    debug('sendStop');
	    self.sendStop = null;
	    clearTimeout(tref);
	  };
	  tref = setTimeout(function() {
	    debug('timeout');
	    self.sendStop = null;
	    self.sendSchedule();
	  }, 25);
	};
	
	BufferedSender.prototype.sendSchedule = function() {
	  debug('sendSchedule', this.sendBuffer.length);
	  var self = this;
	  if (this.sendBuffer.length > 0) {
	    var payload = '[' + this.sendBuffer.join(',') + ']';
	    this.sendStop = this.sender(this.url, payload, function(err) {
	      self.sendStop = null;
	      if (err) {
	        debug('error', err);
	        self.emit('close', err.code || 1006, 'Sending error: ' + err);
	        self._cleanup();
	      } else {
	        self.sendScheduleWait();
	      }
	    });
	    this.sendBuffer = [];
	  }
	};
	
	BufferedSender.prototype._cleanup = function() {
	  debug('_cleanup');
	  this.removeAllListeners();
	};
	
	BufferedSender.prototype.stop = function() {
	  debug('stop');
	  this._cleanup();
	  if (this.sendStop) {
	    this.sendStop();
	    this.sendStop = null;
	  }
	};
	
	module.exports = BufferedSender;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:polling');
	}
	
	function Polling(Receiver, receiveUrl, AjaxObject) {
	  debug(receiveUrl);
	  EventEmitter.call(this);
	  this.Receiver = Receiver;
	  this.receiveUrl = receiveUrl;
	  this.AjaxObject = AjaxObject;
	  this._scheduleReceiver();
	}
	
	inherits(Polling, EventEmitter);
	
	Polling.prototype._scheduleReceiver = function() {
	  debug('_scheduleReceiver');
	  var self = this;
	  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
	
	  poll.on('message', function(msg) {
	    debug('message', msg);
	    self.emit('message', msg);
	  });
	
	  poll.once('close', function(code, reason) {
	    debug('close', code, reason, self.pollIsClosing);
	    self.poll = poll = null;
	
	    if (!self.pollIsClosing) {
	      if (reason === 'network') {
	        self._scheduleReceiver();
	      } else {
	        self.emit('close', code || 1006, reason);
	        self.removeAllListeners();
	      }
	    }
	  });
	};
	
	Polling.prototype.abort = function() {
	  debug('abort');
	  this.removeAllListeners();
	  this.pollIsClosing = true;
	  if (this.poll) {
	    this.poll.abort();
	  }
	};
	
	module.exports = Polling;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 360 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:receiver:xhr');
	}
	
	function XhrReceiver(url, AjaxObject) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;
	
	  this.bufferPosition = 0;
	
	  this.xo = new AjaxObject('POST', url, null);
	  this.xo.on('chunk', this._chunkHandler.bind(this));
	  this.xo.once('finish', function(status, text) {
	    debug('finish', status, text);
	    self._chunkHandler(status, text);
	    self.xo = null;
	    var reason = status === 200 ? 'network' : 'permanent';
	    debug('close', reason);
	    self.emit('close', null, reason);
	    self._cleanup();
	  });
	}
	
	inherits(XhrReceiver, EventEmitter);
	
	XhrReceiver.prototype._chunkHandler = function(status, text) {
	  debug('_chunkHandler', status);
	  if (status !== 200 || !text) {
	    return;
	  }
	
	  for (var idx = -1; ; this.bufferPosition += idx + 1) {
	    var buf = text.slice(this.bufferPosition);
	    idx = buf.indexOf('\n');
	    if (idx === -1) {
	      break;
	    }
	    var msg = buf.slice(0, idx);
	    if (msg) {
	      debug('message', msg);
	      this.emit('message', msg);
	    }
	  }
	};
	
	XhrReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  this.removeAllListeners();
	};
	
	XhrReceiver.prototype.abort = function() {
	  debug('abort');
	  if (this.xo) {
	    this.xo.close();
	    debug('close');
	    this.emit('close', null, 'user');
	    this.xo = null;
	  }
	  this._cleanup();
	};
	
	module.exports = XhrReceiver;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , XhrDriver = __webpack_require__(362)
	  ;
	
	function XHRCorsObject(method, url, payload, opts) {
	  XhrDriver.call(this, method, url, payload, opts);
	}
	
	inherits(XHRCorsObject, XhrDriver);
	
	XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;
	
	module.exports = XHRCorsObject;


/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';
	
	var EventEmitter = __webpack_require__(352).EventEmitter
	  , inherits = __webpack_require__(351)
	  , utils = __webpack_require__(340)
	  , urlUtils = __webpack_require__(343)
	  , XHR = global.XMLHttpRequest
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:browser:xhr');
	}
	
	function AbstractXHRObject(method, url, payload, opts) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);
	
	  setTimeout(function () {
	    self._start(method, url, payload, opts);
	  }, 0);
	}
	
	inherits(AbstractXHRObject, EventEmitter);
	
	AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
	  var self = this;
	
	  try {
	    this.xhr = new XHR();
	  } catch (x) {}
	
	  if (!this.xhr) {
	    debug('no xhr');
	    this.emit('finish', 0, 'no xhr support');
	    this._cleanup();
	    return;
	  }
	
	  // several browsers cache POSTs
	  url = urlUtils.addQuery(url, 't=' + (+new Date()));
	
	  // Explorer tends to keep connection open, even after the
	  // tab gets closed: http://bugs.jquery.com/ticket/5280
	  this.unloadRef = utils.unloadAdd(function() {
	    debug('unload cleanup');
	    self._cleanup(true);
	  });
	  try {
	    this.xhr.open(method, url, true);
	    if (this.timeout && 'timeout' in this.xhr) {
	      this.xhr.timeout = this.timeout;
	      this.xhr.ontimeout = function() {
	        debug('xhr timeout');
	        self.emit('finish', 0, '');
	        self._cleanup(false);
	      };
	    }
	  } catch (e) {
	    debug('exception', e);
	    // IE raises an exception on wrong port.
	    this.emit('finish', 0, '');
	    this._cleanup(false);
	    return;
	  }
	
	  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
	    debug('withCredentials');
	    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
	    // "This never affects same-site requests."
	
	    this.xhr.withCredentials = 'true';
	  }
	  if (opts && opts.headers) {
	    for (var key in opts.headers) {
	      this.xhr.setRequestHeader(key, opts.headers[key]);
	    }
	  }
	
	  this.xhr.onreadystatechange = function() {
	    if (self.xhr) {
	      var x = self.xhr;
	      var text, status;
	      debug('readyState', x.readyState);
	      switch (x.readyState) {
	      case 3:
	        // IE doesn't like peeking into responseText or status
	        // on Microsoft.XMLHTTP and readystate=3
	        try {
	          status = x.status;
	          text = x.responseText;
	        } catch (e) {}
	        debug('status', status);
	        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	        if (status === 1223) {
	          status = 204;
	        }
	
	        // IE does return readystate == 3 for 404 answers.
	        if (status === 200 && text && text.length > 0) {
	          debug('chunk');
	          self.emit('chunk', status, text);
	        }
	        break;
	      case 4:
	        status = x.status;
	        debug('status', status);
	        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	        if (status === 1223) {
	          status = 204;
	        }
	        // IE returns this for a bad port
	        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
	        if (status === 12005 || status === 12029) {
	          status = 0;
	        }
	
	        debug('finish', status, x.responseText);
	        self.emit('finish', status, x.responseText);
	        self._cleanup(false);
	        break;
	      }
	    }
	  };
	
	  try {
	    self.xhr.send(payload);
	  } catch (e) {
	    self.emit('finish', 0, '');
	    self._cleanup(false);
	  }
	};
	
	AbstractXHRObject.prototype._cleanup = function(abort) {
	  debug('cleanup');
	  if (!this.xhr) {
	    return;
	  }
	  this.removeAllListeners();
	  utils.unloadDel(this.unloadRef);
	
	  // IE needs this field to be a function
	  this.xhr.onreadystatechange = function() {};
	  if (this.xhr.ontimeout) {
	    this.xhr.ontimeout = null;
	  }
	
	  if (abort) {
	    try {
	      this.xhr.abort();
	    } catch (x) {}
	  }
	  this.unloadRef = this.xhr = null;
	};
	
	AbstractXHRObject.prototype.close = function() {
	  debug('close');
	  this._cleanup(true);
	};
	
	AbstractXHRObject.enabled = !!XHR;
	// override XMLHttpRequest for IE6/7
	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (!AbstractXHRObject.enabled && (axo in global)) {
	  debug('overriding xmlhttprequest');
	  XHR = function() {
	    try {
	      return new global[axo]('Microsoft.XMLHTTP');
	    } catch (e) {
	      return null;
	    }
	  };
	  AbstractXHRObject.enabled = !!new XHR();
	}
	
	var cors = false;
	try {
	  cors = 'withCredentials' in new XHR();
	} catch (ignored) {}
	
	AbstractXHRObject.supportsCORS = cors;
	
	module.exports = AbstractXHRObject;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(14)))

/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , XhrDriver = __webpack_require__(362)
	  ;
	
	function XHRLocalObject(method, url, payload /*, opts */) {
	  XhrDriver.call(this, method, url, payload, {
	    noCredentials: true
	  });
	}
	
	inherits(XHRLocalObject, XhrDriver);
	
	XHRLocalObject.enabled = XhrDriver.enabled;
	
	module.exports = XHRLocalObject;


/***/ },
/* 364 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	module.exports = {
	  isOpera: function() {
	    return global.navigator &&
	      /opera/i.test(global.navigator.userAgent);
	  }
	
	, isKonqueror: function() {
	    return global.navigator &&
	      /konqueror/i.test(global.navigator.userAgent);
	  }
	
	  // #187 wrap document.domain in try/catch because of WP8 from file:///
	, hasDomain: function () {
	    // non-browser client always has a domain
	    if (!global.document) {
	      return true;
	    }
	
	    try {
	      return !!global.document.domain;
	    } catch (e) {
	      return false;
	    }
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , AjaxBasedTransport = __webpack_require__(356)
	  , XhrReceiver = __webpack_require__(360)
	  , XDRObject = __webpack_require__(366)
	  ;
	
	// According to:
	//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
	//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
	
	function XdrStreamingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
	}
	
	inherits(XdrStreamingTransport, AjaxBasedTransport);
	
	XdrStreamingTransport.enabled = function(info) {
	  if (info.cookie_needed || info.nullOrigin) {
	    return false;
	  }
	  return XDRObject.enabled && info.sameScheme;
	};
	
	XdrStreamingTransport.transportName = 'xdr-streaming';
	XdrStreamingTransport.roundTrips = 2; // preflight, ajax
	
	module.exports = XdrStreamingTransport;


/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var EventEmitter = __webpack_require__(352).EventEmitter
	  , inherits = __webpack_require__(351)
	  , eventUtils = __webpack_require__(340)
	  , browser = __webpack_require__(364)
	  , urlUtils = __webpack_require__(343)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:sender:xdr');
	}
	
	// References:
	//   http://ajaxian.com/archives/100-line-ajax-wrapper
	//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
	
	function XDRObject(method, url, payload) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);
	
	  setTimeout(function() {
	    self._start(method, url, payload);
	  }, 0);
	}
	
	inherits(XDRObject, EventEmitter);
	
	XDRObject.prototype._start = function(method, url, payload) {
	  debug('_start');
	  var self = this;
	  var xdr = new global.XDomainRequest();
	  // IE caches even POSTs
	  url = urlUtils.addQuery(url, 't=' + (+new Date()));
	
	  xdr.onerror = function() {
	    debug('onerror');
	    self._error();
	  };
	  xdr.ontimeout = function() {
	    debug('ontimeout');
	    self._error();
	  };
	  xdr.onprogress = function() {
	    debug('progress', xdr.responseText);
	    self.emit('chunk', 200, xdr.responseText);
	  };
	  xdr.onload = function() {
	    debug('load');
	    self.emit('finish', 200, xdr.responseText);
	    self._cleanup(false);
	  };
	  this.xdr = xdr;
	  this.unloadRef = eventUtils.unloadAdd(function() {
	    self._cleanup(true);
	  });
	  try {
	    // Fails with AccessDenied if port number is bogus
	    this.xdr.open(method, url);
	    if (this.timeout) {
	      this.xdr.timeout = this.timeout;
	    }
	    this.xdr.send(payload);
	  } catch (x) {
	    this._error();
	  }
	};
	
	XDRObject.prototype._error = function() {
	  this.emit('finish', 0, '');
	  this._cleanup(false);
	};
	
	XDRObject.prototype._cleanup = function(abort) {
	  debug('cleanup', abort);
	  if (!this.xdr) {
	    return;
	  }
	  this.removeAllListeners();
	  eventUtils.unloadDel(this.unloadRef);
	
	  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
	  if (abort) {
	    try {
	      this.xdr.abort();
	    } catch (x) {}
	  }
	  this.unloadRef = this.xdr = null;
	};
	
	XDRObject.prototype.close = function() {
	  debug('close');
	  this._cleanup(true);
	};
	
	// IE 8/9 if the request target uses the same scheme - #79
	XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());
	
	module.exports = XDRObject;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 367 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , AjaxBasedTransport = __webpack_require__(356)
	  , EventSourceReceiver = __webpack_require__(368)
	  , XHRCorsObject = __webpack_require__(361)
	  , EventSourceDriver = __webpack_require__(369)
	  ;
	
	function EventSourceTransport(transUrl) {
	  if (!EventSourceTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	
	  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
	}
	
	inherits(EventSourceTransport, AjaxBasedTransport);
	
	EventSourceTransport.enabled = function() {
	  return !!EventSourceDriver;
	};
	
	EventSourceTransport.transportName = 'eventsource';
	EventSourceTransport.roundTrips = 2;
	
	module.exports = EventSourceTransport;


/***/ },
/* 368 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  , EventSourceDriver = __webpack_require__(369)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:receiver:eventsource');
	}
	
	function EventSourceReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);
	
	  var self = this;
	  var es = this.es = new EventSourceDriver(url);
	  es.onmessage = function(e) {
	    debug('message', e.data);
	    self.emit('message', decodeURI(e.data));
	  };
	  es.onerror = function(e) {
	    debug('error', es.readyState, e);
	    // ES on reconnection has readyState = 0 or 1.
	    // on network error it's CLOSED = 2
	    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
	    self._cleanup();
	    self._close(reason);
	  };
	}
	
	inherits(EventSourceReceiver, EventEmitter);
	
	EventSourceReceiver.prototype.abort = function() {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};
	
	EventSourceReceiver.prototype._cleanup = function() {
	  debug('cleanup');
	  var es = this.es;
	  if (es) {
	    es.onmessage = es.onerror = null;
	    es.close();
	    this.es = null;
	  }
	};
	
	EventSourceReceiver.prototype._close = function(reason) {
	  debug('close', reason);
	  var self = this;
	  // Safari and chrome < 15 crash if we close window before
	  // waiting for ES cleanup. See:
	  // https://code.google.com/p/chromium/issues/detail?id=89155
	  setTimeout(function() {
	    self.emit('close', null, reason);
	    self.removeAllListeners();
	  }, 200);
	};
	
	module.exports = EventSourceReceiver;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 369 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.EventSource;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , IframeTransport = __webpack_require__(371)
	  , objectUtils = __webpack_require__(376)
	  ;
	
	module.exports = function(transport) {
	
	  function IframeWrapTransport(transUrl, baseUrl) {
	    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
	  }
	
	  inherits(IframeWrapTransport, IframeTransport);
	
	  IframeWrapTransport.enabled = function(url, info) {
	    if (!global.document) {
	      return false;
	    }
	
	    var iframeInfo = objectUtils.extend({}, info);
	    iframeInfo.sameOrigin = true;
	    return transport.enabled(iframeInfo) && IframeTransport.enabled();
	  };
	
	  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
	  IframeWrapTransport.needBody = true;
	  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)
	
	  IframeWrapTransport.facadeTransport = transport;
	
	  return IframeWrapTransport;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	// Few cool transports do work only for same-origin. In order to make
	// them work cross-domain we shall use iframe, served from the
	// remote domain. New browsers have capabilities to communicate with
	// cross domain iframe using postMessage(). In IE it was implemented
	// from IE 8+, but of course, IE got some details wrong:
	//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
	//    http://stevesouders.com/misc/test-postmessage.php
	
	var inherits = __webpack_require__(351)
	  , JSON3 = __webpack_require__(372)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  , version = __webpack_require__(374)
	  , urlUtils = __webpack_require__(343)
	  , iframeUtils = __webpack_require__(375)
	  , eventUtils = __webpack_require__(340)
	  , random = __webpack_require__(341)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:transport:iframe');
	}
	
	function IframeTransport(transport, transUrl, baseUrl) {
	  if (!IframeTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  EventEmitter.call(this);
	
	  var self = this;
	  this.origin = urlUtils.getOrigin(baseUrl);
	  this.baseUrl = baseUrl;
	  this.transUrl = transUrl;
	  this.transport = transport;
	  this.windowId = random.string(8);
	
	  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
	  debug(transport, transUrl, iframeUrl);
	
	  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
	    debug('err callback');
	    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
	    self.close();
	  });
	
	  this.onmessageCallback = this._message.bind(this);
	  eventUtils.attachEvent('message', this.onmessageCallback);
	}
	
	inherits(IframeTransport, EventEmitter);
	
	IframeTransport.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  if (this.iframeObj) {
	    eventUtils.detachEvent('message', this.onmessageCallback);
	    try {
	      // When the iframe is not loaded, IE raises an exception
	      // on 'contentWindow'.
	      this.postMessage('c');
	    } catch (x) {}
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	    this.onmessageCallback = this.iframeObj = null;
	  }
	};
	
	IframeTransport.prototype._message = function(e) {
	  debug('message', e.data);
	  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
	    debug('not same origin', e.origin, this.origin);
	    return;
	  }
	
	  var iframeMessage;
	  try {
	    iframeMessage = JSON3.parse(e.data);
	  } catch (ignored) {
	    debug('bad json', e.data);
	    return;
	  }
	
	  if (iframeMessage.windowId !== this.windowId) {
	    debug('mismatched window id', iframeMessage.windowId, this.windowId);
	    return;
	  }
	
	  switch (iframeMessage.type) {
	  case 's':
	    this.iframeObj.loaded();
	    // window global dependency
	    this.postMessage('s', JSON3.stringify([
	      version
	    , this.transport
	    , this.transUrl
	    , this.baseUrl
	    ]));
	    break;
	  case 't':
	    this.emit('message', iframeMessage.data);
	    break;
	  case 'c':
	    var cdata;
	    try {
	      cdata = JSON3.parse(iframeMessage.data);
	    } catch (ignored) {
	      debug('bad json', iframeMessage.data);
	      return;
	    }
	    this.emit('close', cdata[0], cdata[1]);
	    this.close();
	    break;
	  }
	};
	
	IframeTransport.prototype.postMessage = function(type, data) {
	  debug('postMessage', type, data);
	  this.iframeObj.post(JSON3.stringify({
	    windowId: this.windowId
	  , type: type
	  , data: data || ''
	  }), this.origin);
	};
	
	IframeTransport.prototype.send = function(message) {
	  debug('send', message);
	  this.postMessage('m', message);
	};
	
	IframeTransport.enabled = function() {
	  return iframeUtils.iframeEnabled;
	};
	
	IframeTransport.transportName = 'iframe';
	IframeTransport.roundTrips = 2;
	
	module.exports = IframeTransport;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
	;(function () {
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(373);
	
	  // A set of types used to distinguish objects from primitives.
	  var objectTypes = {
	    "function": true,
	    "object": true
	  };
	
	  // Detect the `exports` object exposed by CommonJS implementations.
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
	
	  // Use the `global` object exposed by Node (including Browserify via
	  // `insert-module-globals`), Narwhal, and Ringo as the default context,
	  // and the `window` object in browsers. Rhino exports a `global` function
	  // instead.
	  var root = objectTypes[typeof window] && window || this,
	      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;
	
	  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
	    root = freeGlobal;
	  }
	
	  // Public: Initializes JSON 3 using the given `context` object, attaching the
	  // `stringify` and `parse` functions to the specified `exports` object.
	  function runInContext(context, exports) {
	    context || (context = root["Object"]());
	    exports || (exports = root["Object"]());
	
	    // Native constructor aliases.
	    var Number = context["Number"] || root["Number"],
	        String = context["String"] || root["String"],
	        Object = context["Object"] || root["Object"],
	        Date = context["Date"] || root["Date"],
	        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
	        TypeError = context["TypeError"] || root["TypeError"],
	        Math = context["Math"] || root["Math"],
	        nativeJSON = context["JSON"] || root["JSON"];
	
	    // Delegate to the native `stringify` and `parse` implementations.
	    if (typeof nativeJSON == "object" && nativeJSON) {
	      exports.stringify = nativeJSON.stringify;
	      exports.parse = nativeJSON.parse;
	    }
	
	    // Convenience aliases.
	    var objectProto = Object.prototype,
	        getClass = objectProto.toString,
	        isProperty, forEach, undef;
	
	    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	    var isExtended = new Date(-3509827334573292);
	    try {
	      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	      // results for certain dates in Opera >= 10.53.
	      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	        // Safari < 2.0.2 stores the internal millisecond time value correctly,
	        // but clips the values returned by the date methods to the range of
	        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	    } catch (exception) {}
	
	    // Internal: Determines whether the native `JSON.stringify` and `parse`
	    // implementations are spec-compliant. Based on work by Ken Snyder.
	    function has(name) {
	      if (has[name] !== undef) {
	        // Return cached feature test result.
	        return has[name];
	      }
	      var isSupported;
	      if (name == "bug-string-char-index") {
	        // IE <= 7 doesn't support accessing string characters using square
	        // bracket notation. IE 8 only supports this for primitives.
	        isSupported = "a"[0] != "a";
	      } else if (name == "json") {
	        // Indicates whether both `JSON.stringify` and `JSON.parse` are
	        // supported.
	        isSupported = has("json-stringify") && has("json-parse");
	      } else {
	        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	        // Test `JSON.stringify`.
	        if (name == "json-stringify") {
	          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	          if (stringifySupported) {
	            // A test function object with a custom `toJSON` method.
	            (value = function () {
	              return 1;
	            }).toJSON = value;
	            try {
	              stringifySupported =
	                // Firefox 3.1b1 and b2 serialize string, number, and boolean
	                // primitives as object literals.
	                stringify(0) === "0" &&
	                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	                // literals.
	                stringify(new Number()) === "0" &&
	                stringify(new String()) == '""' &&
	                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	                // does not define a canonical JSON representation (this applies to
	                // objects with `toJSON` properties as well, *unless* they are nested
	                // within an object or array).
	                stringify(getClass) === undef &&
	                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	                // FF 3.1b3 pass this test.
	                stringify(undef) === undef &&
	                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	                // respectively, if the value is omitted entirely.
	                stringify() === undef &&
	                // FF 3.1b1, 2 throw an error if the given value is not a number,
	                // string, array, object, Boolean, or `null` literal. This applies to
	                // objects with custom `toJSON` methods as well, unless they are nested
	                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	                // methods entirely.
	                stringify(value) === "1" &&
	                stringify([value]) == "[1]" &&
	                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	                // `"[null]"`.
	                stringify([undef]) == "[null]" &&
	                // YUI 3.0.0b1 fails to serialize `null` literals.
	                stringify(null) == "null" &&
	                // FF 3.1b1, 2 halts serialization if an array contains a function:
	                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	                // elides non-JSON values from objects and arrays, unless they
	                // define custom `toJSON` methods.
	                stringify([undef, getClass, null]) == "[null,null,null]" &&
	                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	                // where character escape codes are expected (e.g., `\b` => `\u0008`).
	                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	                stringify(null, value) === "1" &&
	                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	                // serialize extended years.
	                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	                // The milliseconds are optional in ES 5, but required in 5.1.
	                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	                // four-digit years instead of six-digit years. Credits: @Yaffle.
	                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	                // values less than 1000. Credits: @Yaffle.
	                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	            } catch (exception) {
	              stringifySupported = false;
	            }
	          }
	          isSupported = stringifySupported;
	        }
	        // Test `JSON.parse`.
	        if (name == "json-parse") {
	          var parse = exports.parse;
	          if (typeof parse == "function") {
	            try {
	              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	              // Conforming implementations should also coerce the initial argument to
	              // a string prior to parsing.
	              if (parse("0") === 0 && !parse(false)) {
	                // Simple parsing test.
	                value = parse(serialized);
	                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	                if (parseSupported) {
	                  try {
	                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                    parseSupported = !parse('"\t"');
	                  } catch (exception) {}
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                      // certain octal literals.
	                      parseSupported = parse("01") !== 1;
	                    } catch (exception) {}
	                  }
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                      // points. These environments, along with FF 3.1b1 and 2,
	                      // also allow trailing commas in JSON objects and arrays.
	                      parseSupported = parse("1.") !== 1;
	                    } catch (exception) {}
	                  }
	                }
	              }
	            } catch (exception) {
	              parseSupported = false;
	            }
	          }
	          isSupported = parseSupported;
	        }
	      }
	      return has[name] = !!isSupported;
	    }
	
	    if (!has("json")) {
	      // Common `[[Class]]` name aliases.
	      var functionClass = "[object Function]",
	          dateClass = "[object Date]",
	          numberClass = "[object Number]",
	          stringClass = "[object String]",
	          arrayClass = "[object Array]",
	          booleanClass = "[object Boolean]";
	
	      // Detect incomplete support for accessing string characters by index.
	      var charIndexBuggy = has("bug-string-char-index");
	
	      // Define additional utility methods if the `Date` methods are buggy.
	      if (!isExtended) {
	        var floor = Math.floor;
	        // A mapping between the months of the year and the number of days between
	        // January 1st and the first of the respective month.
	        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	        // Internal: Calculates the number of days between the Unix epoch and the
	        // first day of the given month.
	        var getDay = function (year, month) {
	          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	        };
	      }
	
	      // Internal: Determines if a property is a direct property of the given
	      // object. Delegates to the native `Object#hasOwnProperty` method.
	      if (!(isProperty = objectProto.hasOwnProperty)) {
	        isProperty = function (property) {
	          var members = {}, constructor;
	          if ((members.__proto__ = null, members.__proto__ = {
	            // The *proto* property cannot be set multiple times in recent
	            // versions of Firefox and SeaMonkey.
	            "toString": 1
	          }, members).toString != getClass) {
	            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	            // supports the mutable *proto* property.
	            isProperty = function (property) {
	              // Capture and break the object's prototype chain (see section 8.6.2
	              // of the ES 5.1 spec). The parenthesized expression prevents an
	              // unsafe transformation by the Closure Compiler.
	              var original = this.__proto__, result = property in (this.__proto__ = null, this);
	              // Restore the original prototype chain.
	              this.__proto__ = original;
	              return result;
	            };
	          } else {
	            // Capture a reference to the top-level `Object` constructor.
	            constructor = members.constructor;
	            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	            // other environments.
	            isProperty = function (property) {
	              var parent = (this.constructor || constructor).prototype;
	              return property in this && !(property in parent && this[property] === parent[property]);
	            };
	          }
	          members = null;
	          return isProperty.call(this, property);
	        };
	      }
	
	      // Internal: Normalizes the `for...in` iteration algorithm across
	      // environments. Each enumerated key is yielded to a `callback` function.
	      forEach = function (object, callback) {
	        var size = 0, Properties, members, property;
	
	        // Tests for bugs in the current environment's `for...in` algorithm. The
	        // `valueOf` property inherits the non-enumerable flag from
	        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	        (Properties = function () {
	          this.valueOf = 0;
	        }).prototype.valueOf = 0;
	
	        // Iterate over a new instance of the `Properties` class.
	        members = new Properties();
	        for (property in members) {
	          // Ignore all properties inherited from `Object.prototype`.
	          if (isProperty.call(members, property)) {
	            size++;
	          }
	        }
	        Properties = members = null;
	
	        // Normalize the iteration algorithm.
	        if (!size) {
	          // A list of non-enumerable properties inherited from `Object.prototype`.
	          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	          // properties.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, length;
	            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
	            for (property in object) {
	              // Gecko <= 1.0 enumerates the `prototype` property of functions under
	              // certain conditions; IE does not.
	              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for each non-enumerable property.
	            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	          };
	        } else if (size == 2) {
	          // Safari <= 2.0.4 enumerates shadowed properties twice.
	          forEach = function (object, callback) {
	            // Create a set of iterated properties.
	            var members = {}, isFunction = getClass.call(object) == functionClass, property;
	            for (property in object) {
	              // Store each property name to prevent double enumeration. The
	              // `prototype` property of functions is not enumerated due to cross-
	              // environment inconsistencies.
	              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	          };
	        } else {
	          // No bugs detected; use the standard `for...in` algorithm.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	            for (property in object) {
	              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for the `constructor` property due to
	            // cross-environment inconsistencies.
	            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	              callback(property);
	            }
	          };
	        }
	        return forEach(object, callback);
	      };
	
	      // Public: Serializes a JavaScript `value` as a JSON string. The optional
	      // `filter` argument may specify either a function that alters how object and
	      // array members are serialized, or an array of strings and numbers that
	      // indicates which properties should be serialized. The optional `width`
	      // argument may be either a string or number that specifies the indentation
	      // level of the output.
	      if (!has("json-stringify")) {
	        // Internal: A map of control characters and their escaped equivalents.
	        var Escapes = {
	          92: "\\\\",
	          34: '\\"',
	          8: "\\b",
	          12: "\\f",
	          10: "\\n",
	          13: "\\r",
	          9: "\\t"
	        };
	
	        // Internal: Converts `value` into a zero-padded string such that its
	        // length is at least equal to `width`. The `width` must be <= 6.
	        var leadingZeroes = "000000";
	        var toPaddedString = function (width, value) {
	          // The `|| 0` expression is necessary to work around a bug in
	          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	          return (leadingZeroes + (value || 0)).slice(-width);
	        };
	
	        // Internal: Double-quotes a string `value`, replacing all ASCII control
	        // characters (characters with code unit values between 0 and 31) with
	        // their escaped equivalents. This is an implementation of the
	        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	        var unicodePrefix = "\\u00";
	        var quote = function (value) {
	          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
	          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	          for (; index < length; index++) {
	            var charCode = value.charCodeAt(index);
	            // If the character is a control character, append its Unicode or
	            // shorthand escape sequence; otherwise, append the character as-is.
	            switch (charCode) {
	              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	                result += Escapes[charCode];
	                break;
	              default:
	                if (charCode < 32) {
	                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                  break;
	                }
	                result += useCharIndex ? symbols[index] : value.charAt(index);
	            }
	          }
	          return result + '"';
	        };
	
	        // Internal: Recursively serializes an object. Implements the
	        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	          try {
	            // Necessary for host object support.
	            value = object[property];
	          } catch (exception) {}
	          if (typeof value == "object" && value) {
	            className = getClass.call(value);
	            if (className == dateClass && !isProperty.call(value, "toJSON")) {
	              if (value > -1 / 0 && value < 1 / 0) {
	                // Dates are serialized according to the `Date#toJSON` method
	                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	                // for the ISO 8601 date time string format.
	                if (getDay) {
	                  // Manually compute the year, month, date, hours, minutes,
	                  // seconds, and milliseconds if the `getUTC*` methods are
	                  // buggy. Adapted from @Yaffle's `date-shim` project.
	                  date = floor(value / 864e5);
	                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                  date = 1 + date - getDay(year, month);
	                  // The `time` value specifies the time within the day (see ES
	                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                  // to compute `A modulo B`, as the `%` operator does not
	                  // correspond to the `modulo` operation for negative numbers.
	                  time = (value % 864e5 + 864e5) % 864e5;
	                  // The hours, minutes, seconds, and milliseconds are obtained by
	                  // decomposing the time within the day. See section 15.9.1.10.
	                  hours = floor(time / 36e5) % 24;
	                  minutes = floor(time / 6e4) % 60;
	                  seconds = floor(time / 1e3) % 60;
	                  milliseconds = time % 1e3;
	                } else {
	                  year = value.getUTCFullYear();
	                  month = value.getUTCMonth();
	                  date = value.getUTCDate();
	                  hours = value.getUTCHours();
	                  minutes = value.getUTCMinutes();
	                  seconds = value.getUTCSeconds();
	                  milliseconds = value.getUTCMilliseconds();
	                }
	                // Serialize extended years correctly.
	                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                  // Months, dates, hours, minutes, and seconds should have two
	                  // digits; milliseconds should have three.
	                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                  // Milliseconds are optional in ES 5.0, but required in 5.1.
	                  "." + toPaddedString(3, milliseconds) + "Z";
	              } else {
	                value = null;
	              }
	            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	              // ignores all `toJSON` methods on these objects unless they are
	              // defined directly on an instance.
	              value = value.toJSON(property);
	            }
	          }
	          if (callback) {
	            // If a replacement function was provided, call it to obtain the value
	            // for serialization.
	            value = callback.call(object, property, value);
	          }
	          if (value === null) {
	            return "null";
	          }
	          className = getClass.call(value);
	          if (className == booleanClass) {
	            // Booleans are represented literally.
	            return "" + value;
	          } else if (className == numberClass) {
	            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	            // `"null"`.
	            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	          } else if (className == stringClass) {
	            // Strings are double-quoted and escaped.
	            return quote("" + value);
	          }
	          // Recursively serialize objects and arrays.
	          if (typeof value == "object") {
	            // Check for cyclic structures. This is a linear search; performance
	            // is inversely proportional to the number of unique nested objects.
	            for (length = stack.length; length--;) {
	              if (stack[length] === value) {
	                // Cyclic structures cannot be serialized by `JSON.stringify`.
	                throw TypeError();
	              }
	            }
	            // Add the object to the stack of traversed objects.
	            stack.push(value);
	            results = [];
	            // Save the current indentation level and indent one additional level.
	            prefix = indentation;
	            indentation += whitespace;
	            if (className == arrayClass) {
	              // Recursively serialize array elements.
	              for (index = 0, length = value.length; index < length; index++) {
	                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	                results.push(element === undef ? "null" : element);
	              }
	              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	            } else {
	              // Recursively serialize object members. Members are selected from
	              // either a user-specified list of property names, or the object
	              // itself.
	              forEach(properties || value, function (property) {
	                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	                if (element !== undef) {
	                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                  // is not the empty string, let `member` {quote(property) + ":"}
	                  // be the concatenation of `member` and the `space` character."
	                  // The "`space` character" refers to the literal space
	                  // character, not the `space` {width} argument provided to
	                  // `JSON.stringify`.
	                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	                }
	              });
	              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	            }
	            // Remove the object from the traversed object stack.
	            stack.pop();
	            return result;
	          }
	        };
	
	        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	        exports.stringify = function (source, filter, width) {
	          var whitespace, callback, properties, className;
	          if (objectTypes[typeof filter] && filter) {
	            if ((className = getClass.call(filter)) == functionClass) {
	              callback = filter;
	            } else if (className == arrayClass) {
	              // Convert the property names array into a makeshift set.
	              properties = {};
	              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	            }
	          }
	          if (width) {
	            if ((className = getClass.call(width)) == numberClass) {
	              // Convert the `width` to an integer and create a string containing
	              // `width` number of space characters.
	              if ((width -= width % 1) > 0) {
	                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	              }
	            } else if (className == stringClass) {
	              whitespace = width.length <= 10 ? width : width.slice(0, 10);
	            }
	          }
	          // Opera <= 7.54u2 discards the values associated with empty string keys
	          // (`""`) only if they are used directly within an object member list
	          // (e.g., `!("" in { "": 1})`).
	          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	        };
	      }
	
	      // Public: Parses a JSON source string.
	      if (!has("json-parse")) {
	        var fromCharCode = String.fromCharCode;
	
	        // Internal: A map of escaped control characters and their unescaped
	        // equivalents.
	        var Unescapes = {
	          92: "\\",
	          34: '"',
	          47: "/",
	          98: "\b",
	          116: "\t",
	          110: "\n",
	          102: "\f",
	          114: "\r"
	        };
	
	        // Internal: Stores the parser state.
	        var Index, Source;
	
	        // Internal: Resets the parser state and throws a `SyntaxError`.
	        var abort = function () {
	          Index = Source = null;
	          throw SyntaxError();
	        };
	
	        // Internal: Returns the next token, or `"$"` if the parser has reached
	        // the end of the source string. A token may be a string, number, `null`
	        // literal, or Boolean literal.
	        var lex = function () {
	          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	          while (Index < length) {
	            charCode = source.charCodeAt(Index);
	            switch (charCode) {
	              case 9: case 10: case 13: case 32:
	                // Skip whitespace tokens, including tabs, carriage returns, line
	                // feeds, and space characters.
	                Index++;
	                break;
	              case 123: case 125: case 91: case 93: case 58: case 44:
	                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	                // the current position.
	                value = charIndexBuggy ? source.charAt(Index) : source[Index];
	                Index++;
	                return value;
	              case 34:
	                // `"` delimits a JSON string; advance to the next character and
	                // begin parsing the string. String tokens are prefixed with the
	                // sentinel `@` character to distinguish them from punctuators and
	                // end-of-string tokens.
	                for (value = "@", Index++; Index < length;) {
	                  charCode = source.charCodeAt(Index);
	                  if (charCode < 32) {
	                    // Unescaped ASCII control characters (those with a code unit
	                    // less than the space character) are not permitted.
	                    abort();
	                  } else if (charCode == 92) {
	                    // A reverse solidus (`\`) marks the beginning of an escaped
	                    // control character (including `"`, `\`, and `/`) or Unicode
	                    // escape sequence.
	                    charCode = source.charCodeAt(++Index);
	                    switch (charCode) {
	                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                        // Revive escaped control characters.
	                        value += Unescapes[charCode];
	                        Index++;
	                        break;
	                      case 117:
	                        // `\u` marks the beginning of a Unicode escape sequence.
	                        // Advance to the first character and validate the
	                        // four-digit code point.
	                        begin = ++Index;
	                        for (position = Index + 4; Index < position; Index++) {
	                          charCode = source.charCodeAt(Index);
	                          // A valid sequence comprises four hexdigits (case-
	                          // insensitive) that form a single hexadecimal value.
	                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                            // Invalid Unicode escape sequence.
	                            abort();
	                          }
	                        }
	                        // Revive the escaped character.
	                        value += fromCharCode("0x" + source.slice(begin, Index));
	                        break;
	                      default:
	                        // Invalid escape sequence.
	                        abort();
	                    }
	                  } else {
	                    if (charCode == 34) {
	                      // An unescaped double-quote character marks the end of the
	                      // string.
	                      break;
	                    }
	                    charCode = source.charCodeAt(Index);
	                    begin = Index;
	                    // Optimize for the common case where a string is valid.
	                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                      charCode = source.charCodeAt(++Index);
	                    }
	                    // Append the string as-is.
	                    value += source.slice(begin, Index);
	                  }
	                }
	                if (source.charCodeAt(Index) == 34) {
	                  // Advance to the next character and return the revived string.
	                  Index++;
	                  return value;
	                }
	                // Unterminated string.
	                abort();
	              default:
	                // Parse numbers and literals.
	                begin = Index;
	                // Advance past the negative sign, if one is specified.
	                if (charCode == 45) {
	                  isSigned = true;
	                  charCode = source.charCodeAt(++Index);
	                }
	                // Parse an integer or floating-point value.
	                if (charCode >= 48 && charCode <= 57) {
	                  // Leading zeroes are interpreted as octal literals.
	                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                    // Illegal octal literal.
	                    abort();
	                  }
	                  isSigned = false;
	                  // Parse the integer component.
	                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                  // Floats cannot contain a leading decimal point; however, this
	                  // case is already accounted for by the parser.
	                  if (source.charCodeAt(Index) == 46) {
	                    position = ++Index;
	                    // Parse the decimal component.
	                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal trailing decimal.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Parse exponents. The `e` denoting the exponent is
	                  // case-insensitive.
	                  charCode = source.charCodeAt(Index);
	                  if (charCode == 101 || charCode == 69) {
	                    charCode = source.charCodeAt(++Index);
	                    // Skip past the sign following the exponent, if one is
	                    // specified.
	                    if (charCode == 43 || charCode == 45) {
	                      Index++;
	                    }
	                    // Parse the exponential component.
	                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal empty exponent.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Coerce the parsed value to a JavaScript number.
	                  return +source.slice(begin, Index);
	                }
	                // A negative sign may only precede numbers.
	                if (isSigned) {
	                  abort();
	                }
	                // `true`, `false`, and `null` literals.
	                if (source.slice(Index, Index + 4) == "true") {
	                  Index += 4;
	                  return true;
	                } else if (source.slice(Index, Index + 5) == "false") {
	                  Index += 5;
	                  return false;
	                } else if (source.slice(Index, Index + 4) == "null") {
	                  Index += 4;
	                  return null;
	                }
	                // Unrecognized token.
	                abort();
	            }
	          }
	          // Return the sentinel `$` character if the parser has reached the end
	          // of the source string.
	          return "$";
	        };
	
	        // Internal: Parses a JSON `value` token.
	        var get = function (value) {
	          var results, hasMembers;
	          if (value == "$") {
	            // Unexpected end of input.
	            abort();
	          }
	          if (typeof value == "string") {
	            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	              // Remove the sentinel `@` character.
	              return value.slice(1);
	            }
	            // Parse object and array literals.
	            if (value == "[") {
	              // Parses a JSON array, returning a new JavaScript array.
	              results = [];
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing square bracket marks the end of the array literal.
	                if (value == "]") {
	                  break;
	                }
	                // If the array literal contains elements, the current token
	                // should be a comma separating the previous element from the
	                // next.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "]") {
	                      // Unexpected trailing `,` in array literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each array element.
	                    abort();
	                  }
	                }
	                // Elisions and leading commas are not permitted.
	                if (value == ",") {
	                  abort();
	                }
	                results.push(get(value));
	              }
	              return results;
	            } else if (value == "{") {
	              // Parses a JSON object, returning a new JavaScript object.
	              results = {};
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing curly brace marks the end of the object literal.
	                if (value == "}") {
	                  break;
	                }
	                // If the object literal contains members, the current token
	                // should be a comma separator.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "}") {
	                      // Unexpected trailing `,` in object literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each object member.
	                    abort();
	                  }
	                }
	                // Leading commas are not permitted, object property names must be
	                // double-quoted strings, and a `:` must separate each property
	                // name and value.
	                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                  abort();
	                }
	                results[value.slice(1)] = get(lex());
	              }
	              return results;
	            }
	            // Unexpected token encountered.
	            abort();
	          }
	          return value;
	        };
	
	        // Internal: Updates a traversed object member.
	        var update = function (source, property, callback) {
	          var element = walk(source, property, callback);
	          if (element === undef) {
	            delete source[property];
	          } else {
	            source[property] = element;
	          }
	        };
	
	        // Internal: Recursively traverses a parsed JSON object, invoking the
	        // `callback` function for each value. This is an implementation of the
	        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	        var walk = function (source, property, callback) {
	          var value = source[property], length;
	          if (typeof value == "object" && value) {
	            // `forEach` can't be used to traverse an array in Opera <= 8.54
	            // because its `Object#hasOwnProperty` implementation returns `false`
	            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	            if (getClass.call(value) == arrayClass) {
	              for (length = value.length; length--;) {
	                update(value, length, callback);
	              }
	            } else {
	              forEach(value, function (property) {
	                update(value, property, callback);
	              });
	            }
	          }
	          return callback.call(source, property, value);
	        };
	
	        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	        exports.parse = function (source, callback) {
	          var result, value;
	          Index = 0;
	          Source = "" + source;
	          result = get(lex());
	          // If a JSON string contains multiple tokens, it is invalid.
	          if (lex() != "$") {
	            abort();
	          }
	          // Reset the parser state.
	          Index = Source = null;
	          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	        };
	      }
	    }
	
	    exports["runInContext"] = runInContext;
	    return exports;
	  }
	
	  if (freeExports && !isLoader) {
	    // Export for CommonJS environments.
	    runInContext(root, freeExports);
	  } else {
	    // Export for web browsers and JavaScript engines.
	    var nativeJSON = root.JSON,
	        previousJSON = root["JSON3"],
	        isRestored = false;
	
	    var JSON3 = runInContext(root, (root["JSON3"] = {
	      // Public: Restores the original value of the global `JSON` object and
	      // returns a reference to the `JSON3` object.
	      "noConflict": function () {
	        if (!isRestored) {
	          isRestored = true;
	          root.JSON = nativeJSON;
	          root["JSON3"] = previousJSON;
	          nativeJSON = previousJSON = null;
	        }
	        return JSON3;
	      }
	    }));
	
	    root.JSON = {
	      "parse": JSON3.parse,
	      "stringify": JSON3.stringify
	    };
	  }
	
	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 373 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 374 */
/***/ function(module, exports) {

	module.exports = '1.0.3';

/***/ },
/* 375 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var eventUtils = __webpack_require__(340)
	  , JSON3 = __webpack_require__(372)
	  , browser = __webpack_require__(364)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:utils:iframe');
	}
	
	module.exports = {
	  WPrefix: '_jp'
	, currentWindowId: null
	
	, polluteGlobalNamespace: function() {
	    if (!(module.exports.WPrefix in global)) {
	      global[module.exports.WPrefix] = {};
	    }
	  }
	
	, postMessage: function(type, data) {
	    if (global.parent !== global) {
	      global.parent.postMessage(JSON3.stringify({
	        windowId: module.exports.currentWindowId
	      , type: type
	      , data: data || ''
	      }), '*');
	    } else {
	      debug('Cannot postMessage, no parent window.', type, data);
	    }
	  }
	
	, createIframe: function(iframeUrl, errorCallback) {
	    var iframe = global.document.createElement('iframe');
	    var tref, unloadRef;
	    var unattach = function() {
	      debug('unattach');
	      clearTimeout(tref);
	      // Explorer had problems with that.
	      try {
	        iframe.onload = null;
	      } catch (x) {}
	      iframe.onerror = null;
	    };
	    var cleanup = function() {
	      debug('cleanup');
	      if (iframe) {
	        unattach();
	        // This timeout makes chrome fire onbeforeunload event
	        // within iframe. Without the timeout it goes straight to
	        // onunload.
	        setTimeout(function() {
	          if (iframe) {
	            iframe.parentNode.removeChild(iframe);
	          }
	          iframe = null;
	        }, 0);
	        eventUtils.unloadDel(unloadRef);
	      }
	    };
	    var onerror = function(err) {
	      debug('onerror', err);
	      if (iframe) {
	        cleanup();
	        errorCallback(err);
	      }
	    };
	    var post = function(msg, origin) {
	      debug('post', msg, origin);
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function() {
	          if (iframe && iframe.contentWindow) {
	            iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {}
	    };
	
	    iframe.src = iframeUrl;
	    iframe.style.display = 'none';
	    iframe.style.position = 'absolute';
	    iframe.onerror = function() {
	      onerror('onerror');
	    };
	    iframe.onload = function() {
	      debug('onload');
	      // `onload` is triggered before scripts on the iframe are
	      // executed. Give it few seconds to actually load stuff.
	      clearTimeout(tref);
	      tref = setTimeout(function() {
	        onerror('onload timeout');
	      }, 2000);
	    };
	    global.document.body.appendChild(iframe);
	    tref = setTimeout(function() {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post
	    , cleanup: cleanup
	    , loaded: unattach
	    };
	  }
	
	/* jshint undef: false, newcap: false */
	/* eslint no-undef: 0, new-cap: 0 */
	, createHtmlfile: function(iframeUrl, errorCallback) {
	    var axo = ['Active'].concat('Object').join('X');
	    var doc = new global[axo]('htmlfile');
	    var tref, unloadRef;
	    var iframe;
	    var unattach = function() {
	      clearTimeout(tref);
	      iframe.onerror = null;
	    };
	    var cleanup = function() {
	      if (doc) {
	        unattach();
	        eventUtils.unloadDel(unloadRef);
	        iframe.parentNode.removeChild(iframe);
	        iframe = doc = null;
	        CollectGarbage();
	      }
	    };
	    var onerror = function(r)  {
	      debug('onerror', r);
	      if (doc) {
	        cleanup();
	        errorCallback(r);
	      }
	    };
	    var post = function(msg, origin) {
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function() {
	          if (iframe && iframe.contentWindow) {
	              iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {}
	    };
	
	    doc.open();
	    doc.write('<html><s' + 'cript>' +
	              'document.domain="' + global.document.domain + '";' +
	              '</s' + 'cript></html>');
	    doc.close();
	    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
	    var c = doc.createElement('div');
	    doc.body.appendChild(c);
	    iframe = doc.createElement('iframe');
	    c.appendChild(iframe);
	    iframe.src = iframeUrl;
	    iframe.onerror = function() {
	      onerror('onerror');
	    };
	    tref = setTimeout(function() {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post
	    , cleanup: cleanup
	    , loaded: unattach
	    };
	  }
	};
	
	module.exports.iframeEnabled = false;
	if (global.document) {
	  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
	  // huge delay, or not at all.
	  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
	    typeof global.postMessage === 'object') && (!browser.isKonqueror());
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 376 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  isObject: function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  }
	
	, extend: function(obj) {
	    if (!this.isObject(obj)) {
	      return obj;
	    }
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (Object.prototype.hasOwnProperty.call(source, prop)) {
	          obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  }
	};


/***/ },
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , HtmlfileReceiver = __webpack_require__(378)
	  , XHRLocalObject = __webpack_require__(363)
	  , AjaxBasedTransport = __webpack_require__(356)
	  ;
	
	function HtmlFileTransport(transUrl) {
	  if (!HtmlfileReceiver.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
	}
	
	inherits(HtmlFileTransport, AjaxBasedTransport);
	
	HtmlFileTransport.enabled = function(info) {
	  return HtmlfileReceiver.enabled && info.sameOrigin;
	};
	
	HtmlFileTransport.transportName = 'htmlfile';
	HtmlFileTransport.roundTrips = 2;
	
	module.exports = HtmlFileTransport;


/***/ },
/* 378 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var inherits = __webpack_require__(351)
	  , iframeUtils = __webpack_require__(375)
	  , urlUtils = __webpack_require__(343)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  , random = __webpack_require__(341)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:receiver:htmlfile');
	}
	
	function HtmlfileReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;
	  iframeUtils.polluteGlobalNamespace();
	
	  this.id = 'a' + random.string(6);
	  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));
	
	  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
	  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
	      iframeUtils.createHtmlfile : iframeUtils.createIframe;
	
	  global[iframeUtils.WPrefix][this.id] = {
	    start: function() {
	      debug('start');
	      self.iframeObj.loaded();
	    }
	  , message: function(data) {
	      debug('message', data);
	      self.emit('message', data);
	    }
	  , stop: function() {
	      debug('stop');
	      self._cleanup();
	      self._close('network');
	    }
	  };
	  this.iframeObj = constructFunc(url, function() {
	    debug('callback');
	    self._cleanup();
	    self._close('permanent');
	  });
	}
	
	inherits(HtmlfileReceiver, EventEmitter);
	
	HtmlfileReceiver.prototype.abort = function() {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};
	
	HtmlfileReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  if (this.iframeObj) {
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	  }
	  delete global[iframeUtils.WPrefix][this.id];
	};
	
	HtmlfileReceiver.prototype._close = function(reason) {
	  debug('_close', reason);
	  this.emit('close', null, reason);
	  this.removeAllListeners();
	};
	
	HtmlfileReceiver.htmlfileEnabled = false;
	
	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (axo in global) {
	  try {
	    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
	  } catch (x) {}
	}
	
	HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;
	
	module.exports = HtmlfileReceiver;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 379 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , AjaxBasedTransport = __webpack_require__(356)
	  , XhrReceiver = __webpack_require__(360)
	  , XHRCorsObject = __webpack_require__(361)
	  , XHRLocalObject = __webpack_require__(363)
	  ;
	
	function XhrPollingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
	}
	
	inherits(XhrPollingTransport, AjaxBasedTransport);
	
	XhrPollingTransport.enabled = function(info) {
	  if (info.nullOrigin) {
	    return false;
	  }
	
	  if (XHRLocalObject.enabled && info.sameOrigin) {
	    return true;
	  }
	  return XHRCorsObject.enabled;
	};
	
	XhrPollingTransport.transportName = 'xhr-polling';
	XhrPollingTransport.roundTrips = 2; // preflight, ajax
	
	module.exports = XhrPollingTransport;


/***/ },
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , AjaxBasedTransport = __webpack_require__(356)
	  , XdrStreamingTransport = __webpack_require__(365)
	  , XhrReceiver = __webpack_require__(360)
	  , XDRObject = __webpack_require__(366)
	  ;
	
	function XdrPollingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
	}
	
	inherits(XdrPollingTransport, AjaxBasedTransport);
	
	XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
	XdrPollingTransport.transportName = 'xdr-polling';
	XdrPollingTransport.roundTrips = 2; // preflight, ajax
	
	module.exports = XdrPollingTransport;


/***/ },
/* 381 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	// The simplest and most robust transport, using the well-know cross
	// domain hack - JSONP. This transport is quite inefficient - one
	// message could use up to one http request. But at least it works almost
	// everywhere.
	// Known limitations:
	//   o you will get a spinning cursor
	//   o for Konqueror a dumb timer is needed to detect errors
	
	var inherits = __webpack_require__(351)
	  , SenderReceiver = __webpack_require__(357)
	  , JsonpReceiver = __webpack_require__(382)
	  , jsonpSender = __webpack_require__(383)
	  ;
	
	function JsonPTransport(transUrl) {
	  if (!JsonPTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
	}
	
	inherits(JsonPTransport, SenderReceiver);
	
	JsonPTransport.enabled = function() {
	  return !!global.document;
	};
	
	JsonPTransport.transportName = 'jsonp-polling';
	JsonPTransport.roundTrips = 1;
	JsonPTransport.needBody = true;
	
	module.exports = JsonPTransport;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var utils = __webpack_require__(375)
	  , random = __webpack_require__(341)
	  , browser = __webpack_require__(364)
	  , urlUtils = __webpack_require__(343)
	  , inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:receiver:jsonp');
	}
	
	function JsonpReceiver(url) {
	  debug(url);
	  var self = this;
	  EventEmitter.call(this);
	
	  utils.polluteGlobalNamespace();
	
	  this.id = 'a' + random.string(6);
	  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));
	
	  global[utils.WPrefix][this.id] = this._callback.bind(this);
	  this._createScript(urlWithId);
	
	  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
	  this.timeoutId = setTimeout(function() {
	    debug('timeout');
	    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
	  }, JsonpReceiver.timeout);
	}
	
	inherits(JsonpReceiver, EventEmitter);
	
	JsonpReceiver.prototype.abort = function() {
	  debug('abort');
	  if (global[utils.WPrefix][this.id]) {
	    var err = new Error('JSONP user aborted read');
	    err.code = 1000;
	    this._abort(err);
	  }
	};
	
	JsonpReceiver.timeout = 35000;
	JsonpReceiver.scriptErrorTimeout = 1000;
	
	JsonpReceiver.prototype._callback = function(data) {
	  debug('_callback', data);
	  this._cleanup();
	
	  if (this.aborting) {
	    return;
	  }
	
	  if (data) {
	    debug('message', data);
	    this.emit('message', data);
	  }
	  this.emit('close', null, 'network');
	  this.removeAllListeners();
	};
	
	JsonpReceiver.prototype._abort = function(err) {
	  debug('_abort', err);
	  this._cleanup();
	  this.aborting = true;
	  this.emit('close', err.code, err.message);
	  this.removeAllListeners();
	};
	
	JsonpReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  clearTimeout(this.timeoutId);
	  if (this.script2) {
	    this.script2.parentNode.removeChild(this.script2);
	    this.script2 = null;
	  }
	  if (this.script) {
	    var script = this.script;
	    // Unfortunately, you can't really abort script loading of
	    // the script.
	    script.parentNode.removeChild(script);
	    script.onreadystatechange = script.onerror =
	        script.onload = script.onclick = null;
	    this.script = null;
	  }
	  delete global[utils.WPrefix][this.id];
	};
	
	JsonpReceiver.prototype._scriptError = function() {
	  debug('_scriptError');
	  var self = this;
	  if (this.errorTimer) {
	    return;
	  }
	
	  this.errorTimer = setTimeout(function() {
	    if (!self.loadedOkay) {
	      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
	    }
	  }, JsonpReceiver.scriptErrorTimeout);
	};
	
	JsonpReceiver.prototype._createScript = function(url) {
	  debug('_createScript', url);
	  var self = this;
	  var script = this.script = global.document.createElement('script');
	  var script2;  // Opera synchronous load trick.
	
	  script.id = 'a' + random.string(8);
	  script.src = url;
	  script.type = 'text/javascript';
	  script.charset = 'UTF-8';
	  script.onerror = this._scriptError.bind(this);
	  script.onload = function() {
	    debug('onload');
	    self._abort(new Error('JSONP script loaded abnormally (onload)'));
	  };
	
	  // IE9 fires 'error' event after onreadystatechange or before, in random order.
	  // Use loadedOkay to determine if actually errored
	  script.onreadystatechange = function() {
	    debug('onreadystatechange', script.readyState);
	    if (/loaded|closed/.test(script.readyState)) {
	      if (script && script.htmlFor && script.onclick) {
	        self.loadedOkay = true;
	        try {
	          // In IE, actually execute the script.
	          script.onclick();
	        } catch (x) {}
	      }
	      if (script) {
	        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
	      }
	    }
	  };
	  // IE: event/htmlFor/onclick trick.
	  // One can't rely on proper order for onreadystatechange. In order to
	  // make sure, set a 'htmlFor' and 'event' properties, so that
	  // script code will be installed as 'onclick' handler for the
	  // script object. Later, onreadystatechange, manually execute this
	  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
	  // set. For reference see:
	  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
	  // Also, read on that about script ordering:
	  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	  if (typeof script.async === 'undefined' && global.document.attachEvent) {
	    // According to mozilla docs, in recent browsers script.async defaults
	    // to 'true', so we may use it to detect a good browser:
	    // https://developer.mozilla.org/en/HTML/Element/script
	    if (!browser.isOpera()) {
	      // Naively assume we're in IE
	      try {
	        script.htmlFor = script.id;
	        script.event = 'onclick';
	      } catch (x) {}
	      script.async = true;
	    } else {
	      // Opera, second sync script hack
	      script2 = this.script2 = global.document.createElement('script');
	      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
	      script.async = script2.async = false;
	    }
	  }
	  if (typeof script.async !== 'undefined') {
	    script.async = true;
	  }
	
	  var head = global.document.getElementsByTagName('head')[0];
	  head.insertBefore(script, head.firstChild);
	  if (script2) {
	    head.insertBefore(script2, head.firstChild);
	  }
	};
	
	module.exports = JsonpReceiver;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 383 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var random = __webpack_require__(341)
	  , urlUtils = __webpack_require__(343)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:sender:jsonp');
	}
	
	var form, area;
	
	function createIframe(id) {
	  debug('createIframe', id);
	  try {
	    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	    return global.document.createElement('<iframe name="' + id + '">');
	  } catch (x) {
	    var iframe = global.document.createElement('iframe');
	    iframe.name = id;
	    return iframe;
	  }
	}
	
	function createForm() {
	  debug('createForm');
	  form = global.document.createElement('form');
	  form.style.display = 'none';
	  form.style.position = 'absolute';
	  form.method = 'POST';
	  form.enctype = 'application/x-www-form-urlencoded';
	  form.acceptCharset = 'UTF-8';
	
	  area = global.document.createElement('textarea');
	  area.name = 'd';
	  form.appendChild(area);
	
	  global.document.body.appendChild(form);
	}
	
	module.exports = function(url, payload, callback) {
	  debug(url, payload);
	  if (!form) {
	    createForm();
	  }
	  var id = 'a' + random.string(8);
	  form.target = id;
	  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);
	
	  var iframe = createIframe(id);
	  iframe.id = id;
	  iframe.style.display = 'none';
	  form.appendChild(iframe);
	
	  try {
	    area.value = payload;
	  } catch (e) {
	    // seriously broken browsers get here
	  }
	  form.submit();
	
	  var completed = function(err) {
	    debug('completed', id, err);
	    if (!iframe.onerror) {
	      return;
	    }
	    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
	    // Opera mini doesn't like if we GC iframe
	    // immediately, thus this timeout.
	    setTimeout(function() {
	      debug('cleaning up', id);
	      iframe.parentNode.removeChild(iframe);
	      iframe = null;
	    }, 500);
	    area.value = '';
	    // It is not possible to detect if the iframe succeeded or
	    // failed to submit our form.
	    callback(err);
	  };
	  iframe.onerror = function() {
	    debug('onerror', id);
	    completed();
	  };
	  iframe.onload = function() {
	    debug('onload', id);
	    completed();
	  };
	  iframe.onreadystatechange = function(e) {
	    debug('onreadystatechange', id, iframe.readyState, e);
	    if (iframe.readyState === 'complete') {
	      completed();
	    }
	  };
	  return function() {
	    debug('aborted', id);
	    completed(new Error('Aborted'));
	  };
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 384 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	__webpack_require__(385);
	
	var URL = __webpack_require__(344)
	  , inherits = __webpack_require__(351)
	  , JSON3 = __webpack_require__(372)
	  , random = __webpack_require__(341)
	  , escape = __webpack_require__(386)
	  , urlUtils = __webpack_require__(343)
	  , eventUtils = __webpack_require__(340)
	  , transport = __webpack_require__(387)
	  , objectUtils = __webpack_require__(376)
	  , browser = __webpack_require__(364)
	  , log = __webpack_require__(388)
	  , Event = __webpack_require__(389)
	  , EventTarget = __webpack_require__(353)
	  , loc = __webpack_require__(390)
	  , CloseEvent = __webpack_require__(391)
	  , TransportMessageEvent = __webpack_require__(392)
	  , InfoReceiver = __webpack_require__(393)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  // Make debug module available globally so you can enable via the console easily
	  global.dbg = __webpack_require__(348);
	  debug = global.dbg('sockjs-client:main');
	}
	
	var transports;
	
	// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
	function SockJS(url, protocols, options) {
	  if (!(this instanceof SockJS)) {
	    return new SockJS(url, protocols, options);
	  }
	  if (arguments.length < 1) {
	    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
	  }
	  EventTarget.call(this);
	
	  this.readyState = SockJS.CONNECTING;
	  this.extensions = '';
	  this.protocol = '';
	
	  // non-standard extension
	  options = options || {};
	  if (options.protocols_whitelist) {
	    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
	  }
	  this._transportsWhitelist = options.transports;
	
	  var sessionId = options.sessionId || 8;
	  if (typeof sessionId === 'function') {
	    this._generateSessionId = sessionId;
	  } else if (typeof sessionId === 'number') {
	    this._generateSessionId = function() {
	      return random.string(sessionId);
	    };
	  } else {
	    throw new TypeError("If sessionId is used in the options, it needs to be a number or a function.");
	  }
	
	  this._server = options.server || random.numberString(1000);
	
	  // Step 1 of WS spec - parse and validate the url. Issue #8
	  var parsedUrl = new URL(url);
	  if (!parsedUrl.host || !parsedUrl.protocol) {
	    throw new SyntaxError("The URL '" + url + "' is invalid");
	  } else if (parsedUrl.hash) {
	    throw new SyntaxError('The URL must not contain a fragment');
	  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
	    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
	  }
	
	  var secure = parsedUrl.protocol === 'https:';
	  // Step 2 - don't allow secure origin with an insecure protocol
	  if (loc.protocol === 'https' && !secure) {
	    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
	  }
	
	  // Step 3 - check port access - no need here
	  // Step 4 - parse protocols argument
	  if (!protocols) {
	    protocols = [];
	  } else if (!Array.isArray(protocols)) {
	    protocols = [protocols];
	  }
	
	  // Step 5 - check protocols argument
	  var sortedProtocols = protocols.sort();
	  sortedProtocols.forEach(function(proto, i) {
	    if (!proto) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
	    }
	    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
	    }
	  });
	
	  // Step 6 - convert origin
	  var o = urlUtils.getOrigin(loc.href);
	  this._origin = o ? o.toLowerCase() : null;
	
	  // remove the trailing slash
	  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));
	
	  // store the sanitized url
	  this.url = parsedUrl.href;
	  debug('using url', this.url);
	
	  // Step 7 - start connection in background
	  // obtain server info
	  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
	  this._urlInfo = {
	    nullOrigin: !browser.hasDomain()
	  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
	  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
	  };
	
	  this._ir = new InfoReceiver(this.url, this._urlInfo);
	  this._ir.once('finish', this._receiveInfo.bind(this));
	}
	
	inherits(SockJS, EventTarget);
	
	function userSetCode(code) {
	  return code === 1000 || (code >= 3000 && code <= 4999);
	}
	
	SockJS.prototype.close = function(code, reason) {
	  // Step 1
	  if (code && !userSetCode(code)) {
	    throw new Error('InvalidAccessError: Invalid code');
	  }
	  // Step 2.4 states the max is 123 bytes, but we are just checking length
	  if (reason && reason.length > 123) {
	    throw new SyntaxError('reason argument has an invalid length');
	  }
	
	  // Step 3.1
	  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
	    return;
	  }
	
	  // TODO look at docs to determine how to set this
	  var wasClean = true;
	  this._close(code || 1000, reason || 'Normal closure', wasClean);
	};
	
	SockJS.prototype.send = function(data) {
	  // #13 - convert anything non-string to string
	  // TODO this currently turns objects into [object Object]
	  if (typeof data !== 'string') {
	    data = '' + data;
	  }
	  if (this.readyState === SockJS.CONNECTING) {
	    throw new Error('InvalidStateError: The connection has not been established yet');
	  }
	  if (this.readyState !== SockJS.OPEN) {
	    return;
	  }
	  this._transport.send(escape.quote(data));
	};
	
	SockJS.version = __webpack_require__(374);
	
	SockJS.CONNECTING = 0;
	SockJS.OPEN = 1;
	SockJS.CLOSING = 2;
	SockJS.CLOSED = 3;
	
	SockJS.prototype._receiveInfo = function(info, rtt) {
	  debug('_receiveInfo', rtt);
	  this._ir = null;
	  if (!info) {
	    this._close(1002, 'Cannot connect to server');
	    return;
	  }
	
	  // establish a round-trip timeout (RTO) based on the
	  // round-trip time (RTT)
	  this._rto = this.countRTO(rtt);
	  // allow server to override url used for the actual transport
	  this._transUrl = info.base_url ? info.base_url : this.url;
	  info = objectUtils.extend(info, this._urlInfo);
	  debug('info', info);
	  // determine list of desired and supported transports
	  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
	  this._transports = enabledTransports.main;
	  debug(this._transports.length + ' enabled transports');
	
	  this._connect();
	};
	
	SockJS.prototype._connect = function() {
	  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
	    debug('attempt', Transport.transportName);
	    if (Transport.needBody) {
	      if (!global.document.body ||
	          (typeof global.document.readyState !== 'undefined' &&
	            global.document.readyState !== 'complete' &&
	            global.document.readyState !== 'interactive')) {
	        debug('waiting for body');
	        this._transports.unshift(Transport);
	        eventUtils.attachEvent('load', this._connect.bind(this));
	        return;
	      }
	    }
	
	    // calculate timeout based on RTO and round trips. Default to 5s
	    var timeoutMs = (this._rto * Transport.roundTrips) || 5000;
	    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
	    debug('using timeout', timeoutMs);
	
	    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
	    debug('transport url', transportUrl);
	    var transportObj = new Transport(transportUrl, this._transUrl);
	    transportObj.on('message', this._transportMessage.bind(this));
	    transportObj.once('close', this._transportClose.bind(this));
	    transportObj.transportName = Transport.transportName;
	    this._transport = transportObj;
	
	    return;
	  }
	  this._close(2000, 'All transports failed', false);
	};
	
	SockJS.prototype._transportTimeout = function() {
	  debug('_transportTimeout');
	  if (this.readyState === SockJS.CONNECTING) {
	    this._transportClose(2007, 'Transport timed out');
	  }
	};
	
	SockJS.prototype._transportMessage = function(msg) {
	  debug('_transportMessage', msg);
	  var self = this
	    , type = msg.slice(0, 1)
	    , content = msg.slice(1)
	    , payload
	    ;
	
	  // first check for messages that don't need a payload
	  switch (type) {
	    case 'o':
	      this._open();
	      return;
	    case 'h':
	      this.dispatchEvent(new Event('heartbeat'));
	      debug('heartbeat', this.transport);
	      return;
	  }
	
	  if (content) {
	    try {
	      payload = JSON3.parse(content);
	    } catch (e) {
	      debug('bad json', content);
	    }
	  }
	
	  if (typeof payload === 'undefined') {
	    debug('empty payload', content);
	    return;
	  }
	
	  switch (type) {
	    case 'a':
	      if (Array.isArray(payload)) {
	        payload.forEach(function(p) {
	          debug('message', self.transport, p);
	          self.dispatchEvent(new TransportMessageEvent(p));
	        });
	      }
	      break;
	    case 'm':
	      debug('message', this.transport, payload);
	      this.dispatchEvent(new TransportMessageEvent(payload));
	      break;
	    case 'c':
	      if (Array.isArray(payload) && payload.length === 2) {
	        this._close(payload[0], payload[1], true);
	      }
	      break;
	  }
	};
	
	SockJS.prototype._transportClose = function(code, reason) {
	  debug('_transportClose', this.transport, code, reason);
	  if (this._transport) {
	    this._transport.removeAllListeners();
	    this._transport = null;
	    this.transport = null;
	  }
	
	  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
	    this._connect();
	    return;
	  }
	
	  this._close(code, reason);
	};
	
	SockJS.prototype._open = function() {
	  debug('_open', this._transport.transportName, this.readyState);
	  if (this.readyState === SockJS.CONNECTING) {
	    if (this._transportTimeoutId) {
	      clearTimeout(this._transportTimeoutId);
	      this._transportTimeoutId = null;
	    }
	    this.readyState = SockJS.OPEN;
	    this.transport = this._transport.transportName;
	    this.dispatchEvent(new Event('open'));
	    debug('connected', this.transport);
	  } else {
	    // The server might have been restarted, and lost track of our
	    // connection.
	    this._close(1006, 'Server lost session');
	  }
	};
	
	SockJS.prototype._close = function(code, reason, wasClean) {
	  debug('_close', this.transport, code, reason, wasClean, this.readyState);
	  var forceFail = false;
	
	  if (this._ir) {
	    forceFail = true;
	    this._ir.close();
	    this._ir = null;
	  }
	  if (this._transport) {
	    this._transport.close();
	    this._transport = null;
	    this.transport = null;
	  }
	
	  if (this.readyState === SockJS.CLOSED) {
	    throw new Error('InvalidStateError: SockJS has already been closed');
	  }
	
	  this.readyState = SockJS.CLOSING;
	  setTimeout(function() {
	    this.readyState = SockJS.CLOSED;
	
	    if (forceFail) {
	      this.dispatchEvent(new Event('error'));
	    }
	
	    var e = new CloseEvent('close');
	    e.wasClean = wasClean || false;
	    e.code = code || 1000;
	    e.reason = reason;
	
	    this.dispatchEvent(e);
	    this.onmessage = this.onclose = this.onerror = null;
	    debug('disconnected');
	  }.bind(this), 0);
	};
	
	// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
	// and RFC 2988.
	SockJS.prototype.countRTO = function(rtt) {
	  // In a local environment, when using IE8/9 and the `jsonp-polling`
	  // transport the time needed to establish a connection (the time that pass
	  // from the opening of the transport to the call of `_dispatchOpen`) is
	  // around 200msec (the lower bound used in the article above) and this
	  // causes spurious timeouts. For this reason we calculate a value slightly
	  // larger than that used in the article.
	  if (rtt > 100) {
	    return 4 * rtt; // rto > 400msec
	  }
	  return 300 + rtt; // 300msec < rto <= 400msec
	};
	
	module.exports = function(availableTransports) {
	  transports = transport(availableTransports);
	  __webpack_require__(398)(SockJS, availableTransports);
	  return SockJS;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 385 */
/***/ function(module, exports) {

	/* eslint-disable */
	/* jscs: disable */
	'use strict';
	
	// pulled specific shims from https://github.com/es-shims/es5-shim
	
	var ArrayPrototype = Array.prototype;
	var ObjectPrototype = Object.prototype;
	var FunctionPrototype = Function.prototype;
	var StringPrototype = String.prototype;
	var array_slice = ArrayPrototype.slice;
	
	var _toString = ObjectPrototype.toString;
	var isFunction = function (val) {
	    return ObjectPrototype.toString.call(val) === '[object Function]';
	};
	var isArray = function isArray(obj) {
	    return _toString.call(obj) === '[object Array]';
	};
	var isString = function isString(obj) {
	    return _toString.call(obj) === '[object String]';
	};
	
	var supportsDescriptors = Object.defineProperty && (function () {
	    try {
	        Object.defineProperty({}, 'x', {});
	        return true;
	    } catch (e) { /* this is ES3 */
	        return false;
	    }
	}());
	
	// Define configurable, writable and non-enumerable props
	// if they don't exist.
	var defineProperty;
	if (supportsDescriptors) {
	    defineProperty = function (object, name, method, forceAssign) {
	        if (!forceAssign && (name in object)) { return; }
	        Object.defineProperty(object, name, {
	            configurable: true,
	            enumerable: false,
	            writable: true,
	            value: method
	        });
	    };
	} else {
	    defineProperty = function (object, name, method, forceAssign) {
	        if (!forceAssign && (name in object)) { return; }
	        object[name] = method;
	    };
	}
	var defineProperties = function (object, map, forceAssign) {
	    for (var name in map) {
	        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
	          defineProperty(object, name, map[name], forceAssign);
	        }
	    }
	};
	
	var toObject = function (o) {
	    if (o == null) { // this matches both null and undefined
	        throw new TypeError("can't convert " + o + ' to object');
	    }
	    return Object(o);
	};
	
	//
	// Util
	// ======
	//
	
	// ES5 9.4
	// http://es5.github.com/#x9.4
	// http://jsperf.com/to-integer
	
	function toInteger(num) {
	    var n = +num;
	    if (n !== n) { // isNaN
	        n = 0;
	    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
	        n = (n > 0 || -1) * Math.floor(Math.abs(n));
	    }
	    return n;
	}
	
	function ToUint32(x) {
	    return x >>> 0;
	}
	
	//
	// Function
	// ========
	//
	
	// ES-5 15.3.4.5
	// http://es5.github.com/#x15.3.4.5
	
	function Empty() {}
	
	defineProperties(FunctionPrototype, {
	    bind: function bind(that) { // .length is 1
	        // 1. Let Target be the this value.
	        var target = this;
	        // 2. If IsCallable(Target) is false, throw a TypeError exception.
	        if (!isFunction(target)) {
	            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	        }
	        // 3. Let A be a new (possibly empty) internal list of all of the
	        //   argument values provided after thisArg (arg1, arg2 etc), in order.
	        // XXX slicedArgs will stand in for "A" if used
	        var args = array_slice.call(arguments, 1); // for normal call
	        // 4. Let F be a new native ECMAScript object.
	        // 11. Set the [[Prototype]] internal property of F to the standard
	        //   built-in Function prototype object as specified in 15.3.3.1.
	        // 12. Set the [[Call]] internal property of F as described in
	        //   15.3.4.5.1.
	        // 13. Set the [[Construct]] internal property of F as described in
	        //   15.3.4.5.2.
	        // 14. Set the [[HasInstance]] internal property of F as described in
	        //   15.3.4.5.3.
	        var binder = function () {
	
	            if (this instanceof bound) {
	                // 15.3.4.5.2 [[Construct]]
	                // When the [[Construct]] internal method of a function object,
	                // F that was created using the bind function is called with a
	                // list of arguments ExtraArgs, the following steps are taken:
	                // 1. Let target be the value of F's [[TargetFunction]]
	                //   internal property.
	                // 2. If target has no [[Construct]] internal method, a
	                //   TypeError exception is thrown.
	                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Construct]] internal
	                //   method of target providing args as the arguments.
	
	                var result = target.apply(
	                    this,
	                    args.concat(array_slice.call(arguments))
	                );
	                if (Object(result) === result) {
	                    return result;
	                }
	                return this;
	
	            } else {
	                // 15.3.4.5.1 [[Call]]
	                // When the [[Call]] internal method of a function object, F,
	                // which was created using the bind function is called with a
	                // this value and a list of arguments ExtraArgs, the following
	                // steps are taken:
	                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 2. Let boundThis be the value of F's [[BoundThis]] internal
	                //   property.
	                // 3. Let target be the value of F's [[TargetFunction]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Call]] internal method
	                //   of target providing boundThis as the this value and
	                //   providing args as the arguments.
	
	                // equiv: target.call(this, ...boundArgs, ...args)
	                return target.apply(
	                    that,
	                    args.concat(array_slice.call(arguments))
	                );
	
	            }
	
	        };
	
	        // 15. If the [[Class]] internal property of Target is "Function", then
	        //     a. Let L be the length property of Target minus the length of A.
	        //     b. Set the length own property of F to either 0 or L, whichever is
	        //       larger.
	        // 16. Else set the length own property of F to 0.
	
	        var boundLength = Math.max(0, target.length - args.length);
	
	        // 17. Set the attributes of the length own property of F to the values
	        //   specified in 15.3.5.1.
	        var boundArgs = [];
	        for (var i = 0; i < boundLength; i++) {
	            boundArgs.push('$' + i);
	        }
	
	        // XXX Build a dynamic function with desired amount of arguments is the only
	        // way to set the length property of a function.
	        // In environments where Content Security Policies enabled (Chrome extensions,
	        // for ex.) all use of eval or Function costructor throws an exception.
	        // However in all of these environments Function.prototype.bind exists
	        // and so this code will never be executed.
	        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
	
	        if (target.prototype) {
	            Empty.prototype = target.prototype;
	            bound.prototype = new Empty();
	            // Clean up dangling references.
	            Empty.prototype = null;
	        }
	
	        // TODO
	        // 18. Set the [[Extensible]] internal property of F to true.
	
	        // TODO
	        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	        // 20. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	        //   false.
	        // 21. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	        //   and false.
	
	        // TODO
	        // NOTE Function objects created using Function.prototype.bind do not
	        // have a prototype property or the [[Code]], [[FormalParameters]], and
	        // [[Scope]] internal properties.
	        // XXX can't delete prototype in pure-js.
	
	        // 22. Return F.
	        return bound;
	    }
	});
	
	//
	// Array
	// =====
	//
	
	// ES5 15.4.3.2
	// http://es5.github.com/#x15.4.3.2
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	defineProperties(Array, { isArray: isArray });
	
	
	var boxedString = Object('a');
	var splitString = boxedString[0] !== 'a' || !(0 in boxedString);
	
	var properlyBoxesContext = function properlyBoxed(method) {
	    // Check node 0.6.21 bug where third parameter is not boxed
	    var properlyBoxesNonStrict = true;
	    var properlyBoxesStrict = true;
	    if (method) {
	        method.call('foo', function (_, __, context) {
	            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
	        });
	
	        method.call([1], function () {
	            'use strict';
	            properlyBoxesStrict = typeof this === 'string';
	        }, 'x');
	    }
	    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
	};
	
	defineProperties(ArrayPrototype, {
	    forEach: function forEach(fun /*, thisp*/) {
	        var object = toObject(this),
	            self = splitString && isString(this) ? this.split('') : object,
	            thisp = arguments[1],
	            i = -1,
	            length = self.length >>> 0;
	
	        // If no callback function or if callback is not a callable function
	        if (!isFunction(fun)) {
	            throw new TypeError(); // TODO message
	        }
	
	        while (++i < length) {
	            if (i in self) {
	                // Invoke the callback function with call, passing arguments:
	                // context, property value, property key, thisArg object
	                // context
	                fun.call(thisp, self[i], i, object);
	            }
	        }
	    }
	}, !properlyBoxesContext(ArrayPrototype.forEach));
	
	// ES5 15.4.4.14
	// http://es5.github.com/#x15.4.4.14
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
	defineProperties(ArrayPrototype, {
	    indexOf: function indexOf(sought /*, fromIndex */ ) {
	        var self = splitString && isString(this) ? this.split('') : toObject(this),
	            length = self.length >>> 0;
	
	        if (!length) {
	            return -1;
	        }
	
	        var i = 0;
	        if (arguments.length > 1) {
	            i = toInteger(arguments[1]);
	        }
	
	        // handle negative indices
	        i = i >= 0 ? i : Math.max(0, length + i);
	        for (; i < length; i++) {
	            if (i in self && self[i] === sought) {
	                return i;
	            }
	        }
	        return -1;
	    }
	}, hasFirefox2IndexOfBug);
	
	//
	// String
	// ======
	//
	
	// ES5 15.5.4.14
	// http://es5.github.com/#x15.5.4.14
	
	// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
	// Many browsers do not split properly with regular expressions or they
	// do not perform the split correctly under obscure conditions.
	// See http://blog.stevenlevithan.com/archives/cross-browser-split
	// I've tested in many browsers and this seems to cover the deviant ones:
	//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
	//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
	//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
	//       [undefined, "t", undefined, "e", ...]
	//    ''.split(/.?/) should be [], not [""]
	//    '.'.split(/()()/) should be ["."], not ["", "", "."]
	
	var string_split = StringPrototype.split;
	if (
	    'ab'.split(/(?:ab)*/).length !== 2 ||
	    '.'.split(/(.?)(.?)/).length !== 4 ||
	    'tesst'.split(/(s)*/)[1] === 't' ||
	    'test'.split(/(?:)/, -1).length !== 4 ||
	    ''.split(/.?/).length ||
	    '.'.split(/()()/).length > 1
	) {
	    (function () {
	        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group
	
	        StringPrototype.split = function (separator, limit) {
	            var string = this;
	            if (separator === void 0 && limit === 0) {
	                return [];
	            }
	
	            // If `separator` is not a regex, use native split
	            if (_toString.call(separator) !== '[object RegExp]') {
	                return string_split.call(this, separator, limit);
	            }
	
	            var output = [],
	                flags = (separator.ignoreCase ? 'i' : '') +
	                        (separator.multiline  ? 'm' : '') +
	                        (separator.extended   ? 'x' : '') + // Proposed for ES6
	                        (separator.sticky     ? 'y' : ''), // Firefox 3+
	                lastLastIndex = 0,
	                // Make `global` and avoid `lastIndex` issues by working with a copy
	                separator2, match, lastIndex, lastLength;
	            separator = new RegExp(separator.source, flags + 'g');
	            string += ''; // Type-convert
	            if (!compliantExecNpcg) {
	                // Doesn't need flags gy, but they don't hurt
	                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
	            }
	            /* Values for `limit`, per the spec:
	             * If undefined: 4294967295 // Math.pow(2, 32) - 1
	             * If 0, Infinity, or NaN: 0
	             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	             * If other: Type-convert, then use the above rules
	             */
	            limit = limit === void 0 ?
	                -1 >>> 0 : // Math.pow(2, 32) - 1
	                ToUint32(limit);
	            while (match = separator.exec(string)) {
	                // `separator.lastIndex` is not reliable cross-browser
	                lastIndex = match.index + match[0].length;
	                if (lastIndex > lastLastIndex) {
	                    output.push(string.slice(lastLastIndex, match.index));
	                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
	                    // nonparticipating capturing groups
	                    if (!compliantExecNpcg && match.length > 1) {
	                        match[0].replace(separator2, function () {
	                            for (var i = 1; i < arguments.length - 2; i++) {
	                                if (arguments[i] === void 0) {
	                                    match[i] = void 0;
	                                }
	                            }
	                        });
	                    }
	                    if (match.length > 1 && match.index < string.length) {
	                        ArrayPrototype.push.apply(output, match.slice(1));
	                    }
	                    lastLength = match[0].length;
	                    lastLastIndex = lastIndex;
	                    if (output.length >= limit) {
	                        break;
	                    }
	                }
	                if (separator.lastIndex === match.index) {
	                    separator.lastIndex++; // Avoid an infinite loop
	                }
	            }
	            if (lastLastIndex === string.length) {
	                if (lastLength || !separator.test('')) {
	                    output.push('');
	                }
	            } else {
	                output.push(string.slice(lastLastIndex));
	            }
	            return output.length > limit ? output.slice(0, limit) : output;
	        };
	    }());
	
	// [bugfix, chrome]
	// If separator is undefined, then the result array contains just one String,
	// which is the this value (converted to a String). If limit is not undefined,
	// then the output array is truncated so that it contains no more than limit
	// elements.
	// "0".split(undefined, 0) -> []
	} else if ('0'.split(void 0, 0).length) {
	    StringPrototype.split = function split(separator, limit) {
	        if (separator === void 0 && limit === 0) { return []; }
	        return string_split.call(this, separator, limit);
	    };
	}
	
	// ES5 15.5.4.20
	// whitespace from: http://es5.github.io/#x15.5.4.20
	var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	    '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
	    '\u2029\uFEFF';
	var zeroWidth = '\u200b';
	var wsRegexChars = '[' + ws + ']';
	var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
	var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
	var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
	defineProperties(StringPrototype, {
	    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
	    // http://perfectionkills.com/whitespace-deviations/
	    trim: function trim() {
	        if (this === void 0 || this === null) {
	            throw new TypeError("can't convert " + this + ' to object');
	        }
	        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
	    }
	}, hasTrimWhitespaceBug);
	
	// ECMA-262, 3rd B.2.3
	// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
	// non-normative section suggesting uniform semantics and it should be
	// normalized across all browsers
	// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
	var string_substr = StringPrototype.substr;
	var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
	defineProperties(StringPrototype, {
	    substr: function substr(start, length) {
	        return string_substr.call(
	            this,
	            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
	            length
	        );
	    }
	}, hasNegativeSubstrBug);


/***/ },
/* 386 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var JSON3 = __webpack_require__(372);
	
	// Some extra characters that Chrome gets wrong, and substitutes with
	// something else on the wire.
	var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
	  , extraLookup;
	
	// This may be quite slow, so let's delay until user actually uses bad
	// characters.
	var unrollLookup = function(escapable) {
	  var i;
	  var unrolled = {};
	  var c = [];
	  for (i = 0; i < 65536; i++) {
	    c.push( String.fromCharCode(i) );
	  }
	  escapable.lastIndex = 0;
	  c.join('').replace(escapable, function(a) {
	    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    return '';
	  });
	  escapable.lastIndex = 0;
	  return unrolled;
	};
	
	// Quote string, also taking care of unicode characters that browsers
	// often break. Especially, take care of unicode surrogates:
	// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
	module.exports = {
	  quote: function(string) {
	    var quoted = JSON3.stringify(string);
	
	    // In most cases this should be very fast and good enough.
	    extraEscapable.lastIndex = 0;
	    if (!extraEscapable.test(quoted)) {
	      return quoted;
	    }
	
	    if (!extraLookup) {
	      extraLookup = unrollLookup(extraEscapable);
	    }
	
	    return quoted.replace(extraEscapable, function(a) {
	      return extraLookup[a];
	    });
	  }
	};


/***/ },
/* 387 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:utils:transport');
	}
	
	module.exports = function(availableTransports) {
	  return {
	    filterToEnabled: function(transportsWhitelist, info) {
	      var transports = {
	        main: []
	      , facade: []
	      };
	      if (!transportsWhitelist) {
	        transportsWhitelist = [];
	      } else if (typeof transportsWhitelist === 'string') {
	        transportsWhitelist = [transportsWhitelist];
	      }
	
	      availableTransports.forEach(function(trans) {
	        if (!trans) {
	          return;
	        }
	
	        if (trans.transportName === 'websocket' && info.websocket === false) {
	          debug('disabled from server', 'websocket');
	          return;
	        }
	
	        if (transportsWhitelist.length &&
	            transportsWhitelist.indexOf(trans.transportName) === -1) {
	          debug('not in whitelist', trans.transportName);
	          return;
	        }
	
	        if (trans.enabled(info)) {
	          debug('enabled', trans.transportName);
	          transports.main.push(trans);
	          if (trans.facadeTransport) {
	            transports.facade.push(trans.facadeTransport);
	          }
	        } else {
	          debug('disabled', trans.transportName);
	        }
	      });
	      return transports;
	    }
	  };
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 388 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var logObject = {};
	['log', 'debug', 'warn'].forEach(function (level) {
	  var levelExists = global.console && global.console[level] && global.console[level].apply;
	  logObject[level] = levelExists ? function () {
	    return global.console[level].apply(global.console, arguments);
	  } : (level === 'log' ? function () {} : logObject.log);
	});
	
	module.exports = logObject;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 389 */
/***/ function(module, exports) {

	'use strict';
	
	function Event(eventType) {
	  this.type = eventType;
	}
	
	Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
	  this.type = eventType;
	  this.bubbles = canBubble;
	  this.cancelable = cancelable;
	  this.timeStamp = +new Date();
	  return this;
	};
	
	Event.prototype.stopPropagation = function() {};
	Event.prototype.preventDefault  = function() {};
	
	Event.CAPTURING_PHASE = 1;
	Event.AT_TARGET       = 2;
	Event.BUBBLING_PHASE  = 3;
	
	module.exports = Event;


/***/ },
/* 390 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	module.exports = global.location || {
	  origin: 'http://localhost:80'
	, protocol: 'http'
	, host: 'localhost'
	, port: 80
	, href: 'http://localhost/'
	, hash: ''
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 391 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , Event = __webpack_require__(389)
	  ;
	
	function CloseEvent() {
	  Event.call(this);
	  this.initEvent('close', false, false);
	  this.wasClean = false;
	  this.code = 0;
	  this.reason = '';
	}
	
	inherits(CloseEvent, Event);
	
	module.exports = CloseEvent;


/***/ },
/* 392 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , Event = __webpack_require__(389)
	  ;
	
	function TransportMessageEvent(data) {
	  Event.call(this);
	  this.initEvent('message', false, false);
	  this.data = data;
	}
	
	inherits(TransportMessageEvent, Event);
	
	module.exports = TransportMessageEvent;


/***/ },
/* 393 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var EventEmitter = __webpack_require__(352).EventEmitter
	  , inherits = __webpack_require__(351)
	  , urlUtils = __webpack_require__(343)
	  , XDR = __webpack_require__(366)
	  , XHRCors = __webpack_require__(361)
	  , XHRLocal = __webpack_require__(363)
	  , XHRFake = __webpack_require__(394)
	  , InfoIframe = __webpack_require__(395)
	  , InfoAjax = __webpack_require__(397)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:info-receiver');
	}
	
	function InfoReceiver(baseUrl, urlInfo) {
	  debug(baseUrl);
	  var self = this;
	  EventEmitter.call(this);
	
	  setTimeout(function() {
	    self.doXhr(baseUrl, urlInfo);
	  }, 0);
	}
	
	inherits(InfoReceiver, EventEmitter);
	
	// TODO this is currently ignoring the list of available transports and the whitelist
	
	InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
	  // determine method of CORS support (if needed)
	  if (urlInfo.sameOrigin) {
	    return new InfoAjax(url, XHRLocal);
	  }
	  if (XHRCors.enabled) {
	    return new InfoAjax(url, XHRCors);
	  }
	  if (XDR.enabled && urlInfo.sameScheme) {
	    return new InfoAjax(url, XDR);
	  }
	  if (InfoIframe.enabled()) {
	    return new InfoIframe(baseUrl, url);
	  }
	  return new InfoAjax(url, XHRFake);
	};
	
	InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
	  var self = this
	    , url = urlUtils.addPath(baseUrl, '/info')
	    ;
	  debug('doXhr', url);
	
	  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);
	
	  this.timeoutRef = setTimeout(function() {
	    debug('timeout');
	    self._cleanup(false);
	    self.emit('finish');
	  }, InfoReceiver.timeout);
	
	  this.xo.once('finish', function(info, rtt) {
	    debug('finish', info, rtt);
	    self._cleanup(true);
	    self.emit('finish', info, rtt);
	  });
	};
	
	InfoReceiver.prototype._cleanup = function(wasClean) {
	  debug('_cleanup');
	  clearTimeout(this.timeoutRef);
	  this.timeoutRef = null;
	  if (!wasClean && this.xo) {
	    this.xo.close();
	  }
	  this.xo = null;
	};
	
	InfoReceiver.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  this._cleanup(false);
	};
	
	InfoReceiver.timeout = 8000;
	
	module.exports = InfoReceiver;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 394 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var EventEmitter = __webpack_require__(352).EventEmitter
	  , inherits = __webpack_require__(351)
	  ;
	
	function XHRFake(/* method, url, payload, opts */) {
	  var self = this;
	  EventEmitter.call(this);
	
	  this.to = setTimeout(function() {
	    self.emit('finish', 200, '{}');
	  }, XHRFake.timeout);
	}
	
	inherits(XHRFake, EventEmitter);
	
	XHRFake.prototype.close = function() {
	  clearTimeout(this.to);
	};
	
	XHRFake.timeout = 2000;
	
	module.exports = XHRFake;


/***/ },
/* 395 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var EventEmitter = __webpack_require__(352).EventEmitter
	  , inherits = __webpack_require__(351)
	  , JSON3 = __webpack_require__(372)
	  , utils = __webpack_require__(340)
	  , IframeTransport = __webpack_require__(371)
	  , InfoReceiverIframe = __webpack_require__(396)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:info-iframe');
	}
	
	function InfoIframe(baseUrl, url) {
	  var self = this;
	  EventEmitter.call(this);
	
	  var go = function() {
	    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);
	
	    ifr.once('message', function(msg) {
	      if (msg) {
	        var d;
	        try {
	          d = JSON3.parse(msg);
	        } catch (e) {
	          debug('bad json', msg);
	          self.emit('finish');
	          self.close();
	          return;
	        }
	
	        var info = d[0], rtt = d[1];
	        self.emit('finish', info, rtt);
	      }
	      self.close();
	    });
	
	    ifr.once('close', function() {
	      self.emit('finish');
	      self.close();
	    });
	  };
	
	  // TODO this seems the same as the 'needBody' from transports
	  if (!global.document.body) {
	    utils.attachEvent('load', go);
	  } else {
	    go();
	  }
	}
	
	inherits(InfoIframe, EventEmitter);
	
	InfoIframe.enabled = function() {
	  return IframeTransport.enabled();
	};
	
	InfoIframe.prototype.close = function() {
	  if (this.ifr) {
	    this.ifr.close();
	  }
	  this.removeAllListeners();
	  this.ifr = null;
	};
	
	module.exports = InfoIframe;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), (function() { return this; }())))

/***/ },
/* 396 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var inherits = __webpack_require__(351)
	  , EventEmitter = __webpack_require__(352).EventEmitter
	  , JSON3 = __webpack_require__(372)
	  , XHRLocalObject = __webpack_require__(363)
	  , InfoAjax = __webpack_require__(397)
	  ;
	
	function InfoReceiverIframe(transUrl) {
	  var self = this;
	  EventEmitter.call(this);
	
	  this.ir = new InfoAjax(transUrl, XHRLocalObject);
	  this.ir.once('finish', function(info, rtt) {
	    self.ir = null;
	    self.emit('message', JSON3.stringify([info, rtt]));
	  });
	}
	
	inherits(InfoReceiverIframe, EventEmitter);
	
	InfoReceiverIframe.transportName = 'iframe-info-receiver';
	
	InfoReceiverIframe.prototype.close = function() {
	  if (this.ir) {
	    this.ir.close();
	    this.ir = null;
	  }
	  this.removeAllListeners();
	};
	
	module.exports = InfoReceiverIframe;


/***/ },
/* 397 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var EventEmitter = __webpack_require__(352).EventEmitter
	  , inherits = __webpack_require__(351)
	  , JSON3 = __webpack_require__(372)
	  , objectUtils = __webpack_require__(376)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:info-ajax');
	}
	
	function InfoAjax(url, AjaxObject) {
	  EventEmitter.call(this);
	
	  var self = this;
	  var t0 = +new Date();
	  this.xo = new AjaxObject('GET', url);
	
	  this.xo.once('finish', function(status, text) {
	    var info, rtt;
	    if (status === 200) {
	      rtt = (+new Date()) - t0;
	      if (text) {
	        try {
	          info = JSON3.parse(text);
	        } catch (e) {
	          debug('bad json', text);
	        }
	      }
	
	      if (!objectUtils.isObject(info)) {
	        info = {};
	      }
	    }
	    self.emit('finish', info, rtt);
	    self.removeAllListeners();
	  });
	}
	
	inherits(InfoAjax, EventEmitter);
	
	InfoAjax.prototype.close = function() {
	  this.removeAllListeners();
	  this.xo.close();
	};
	
	module.exports = InfoAjax;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 398 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var urlUtils = __webpack_require__(343)
	  , eventUtils = __webpack_require__(340)
	  , JSON3 = __webpack_require__(372)
	  , FacadeJS = __webpack_require__(399)
	  , InfoIframeReceiver = __webpack_require__(396)
	  , iframeUtils = __webpack_require__(375)
	  , loc = __webpack_require__(390)
	  ;
	
	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(348)('sockjs-client:iframe-bootstrap');
	}
	
	module.exports = function(SockJS, availableTransports) {
	  var transportMap = {};
	  availableTransports.forEach(function(at) {
	    if (at.facadeTransport) {
	      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
	    }
	  });
	
	  // hard-coded for the info iframe
	  // TODO see if we can make this more dynamic
	  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
	  var parentOrigin;
	
	  /* eslint-disable camelcase */
	  SockJS.bootstrap_iframe = function() {
	    /* eslint-enable camelcase */
	    var facade;
	    iframeUtils.currentWindowId = loc.hash.slice(1);
	    var onMessage = function(e) {
	      if (e.source !== parent) {
	        return;
	      }
	      if (typeof parentOrigin === 'undefined') {
	        parentOrigin = e.origin;
	      }
	      if (e.origin !== parentOrigin) {
	        return;
	      }
	
	      var iframeMessage;
	      try {
	        iframeMessage = JSON3.parse(e.data);
	      } catch (ignored) {
	        debug('bad json', e.data);
	        return;
	      }
	
	      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
	        return;
	      }
	      switch (iframeMessage.type) {
	      case 's':
	        var p;
	        try {
	          p = JSON3.parse(iframeMessage.data);
	        } catch (ignored) {
	          debug('bad json', iframeMessage.data);
	          break;
	        }
	        var version = p[0];
	        var transport = p[1];
	        var transUrl = p[2];
	        var baseUrl = p[3];
	        debug(version, transport, transUrl, baseUrl);
	        // change this to semver logic
	        if (version !== SockJS.version) {
	          throw new Error('Incompatibile SockJS! Main site uses:' +
	                    ' "' + version + '", the iframe:' +
	                    ' "' + SockJS.version + '".');
	        }
	
	        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
	            !urlUtils.isOriginEqual(baseUrl, loc.href)) {
	          throw new Error('Can\'t connect to different domain from within an ' +
	                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
	        }
	        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
	        break;
	      case 'm':
	        facade._send(iframeMessage.data);
	        break;
	      case 'c':
	        if (facade) {
	          facade._close();
	        }
	        facade = null;
	        break;
	      }
	    };
	
	    eventUtils.attachEvent('message', onMessage);
	
	    // Start
	    iframeUtils.postMessage('s');
	  };
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 399 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var JSON3 = __webpack_require__(372)
	  , iframeUtils = __webpack_require__(375)
	  ;
	
	function FacadeJS(transport) {
	  this._transport = transport;
	  transport.on('message', this._transportMessage.bind(this));
	  transport.on('close', this._transportClose.bind(this));
	}
	
	FacadeJS.prototype._transportClose = function(code, reason) {
	  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
	};
	FacadeJS.prototype._transportMessage = function(frame) {
	  iframeUtils.postMessage('t', frame);
	};
	FacadeJS.prototype._send = function(data) {
	  this._transport.send(data);
	};
	FacadeJS.prototype._close = function() {
	  this._transport.close();
	  this._transport.removeAllListeners();
	};
	
	module.exports = FacadeJS;


/***/ },
/* 400 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(401)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 401 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 402 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}
	
				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}
	
				if(!upToDate()) {
					check();
				}
	
				__webpack_require__(403)(updatedModules, updatedModules);
	
				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}
	
			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 403 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});
	
		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}
	
		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ }
]);
//# sourceMappingURL=app.js.map