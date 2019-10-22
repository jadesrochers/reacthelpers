var bundle = (function (exports, R, d3Format, React, fps) {
  'use strict';

  var React__default = 'default' in React ? React['default'] : React;
  fps = fps && fps.hasOwnProperty('default') ? fps['default'] : fps;

  var roundtenth = function roundtenth(n) {
    return Math.round(n * 10) / 10;
  };

  var roundhundth = function roundhundth(n) {
    return Math.round(n * 100) / 100;
  };

  var roundthousth = function roundthousth(n) {
    return Math.round(n * 1000) / 1000;
  };

  var pickformatter = function pickformatter(data) {
    var max = Math.abs(R.reduce(R.max, 0, R.values(data)));
    var formatter;

    if (max >= 10000) {
      formatter = d3Format.formatPrefix('.0', 1e3);
    } else if (max >= 1000) {
      formatter = d3Format.format('.3s');
    } else {
      formatter = d3Format.format('.3~r');
    }

    return formatter;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var passprops = function passprops(pass, children) {
    if (!children) {
      return undefined;
    }

    var propsToChildren = R.map(function (child) {
      return React__default.cloneElement(child, _objectSpread2({}, pass));
    })(fps.toArray(children));
    return propsToChildren;
  };

  var passAllProps = function passAllProps(props) {
    var propsToChildren = passprops(props, props.children);
    return propsToChildren;
  };

  var passExceptChildren = function passExceptChildren(props) {
    var pass = R.dissoc('children', props);
    var propsToChildren = passprops(pass, props.children);
    return propsToChildren;
  };

  var passGivenProps = function passGivenProps(propstopass, children) {
    var propsToChildren = passprops(propstopass, children);
    return propsToChildren;
  };

  var HookWrapper = function HookWrapper(props) {
    var hook = props.hook ? props.hook() : undefined;
    return React__default.createElement("div", {
      hook: hook
    });
  }; // Only needed when a hook has no state updates to force update


  var HookForceWrapper = function HookForceWrapper(props) {
    var hook = props.hook ? function () {
      return props.hook();
    } : undefined;

    var _useState = React.useState(0),
        _useState2 = _slicedToArray(_useState, 2),
        x = _useState2[0],
        setx = _useState2[1];

    return React__default.createElement(HookWrapper, {
      hook: hook,
      forceupdate: setx
    });
  };

  var SvgWrapper = function SvgWrapper(props) {
    var propsToChildren = passExceptChildren(props);
    return React__default.createElement("svg", null, propsToChildren);
  };

  var HooktoChildren = function HooktoChildren(props) {
    var hook = props.hook ? props.hook() : undefined;
    var propsToChildren = R.map(function (child) {
      return React__default.cloneElement(child, _objectSpread2({}, props, {
        select: hook
      }));
    })(fps.toArray(props.children));
    return React__default.createElement("div", {
      hook: hook
    }, propsToChildren);
  };

  exports.HookForceWrapper = HookForceWrapper;
  exports.HookWrapper = HookWrapper;
  exports.HooktoChildren = HooktoChildren;
  exports.SvgWrapper = SvgWrapper;
  exports.passAllProps = passAllProps;
  exports.passExceptChildren = passExceptChildren;
  exports.passGivenProps = passGivenProps;
  exports.pickformatter = pickformatter;
  exports.roundhundth = roundhundth;
  exports.roundtenth = roundtenth;
  exports.roundthousth = roundthousth;

  return exports;

}({}, R, d3Format, React, fps));
