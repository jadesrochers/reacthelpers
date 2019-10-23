'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var R = require('ramda');
var R__default = _interopDefault(R);
var React = require('react');
var React__default = _interopDefault(React);

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function formatDecimal(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

function exponent(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
}

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width === undefined ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

function formatRounded(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

var formatTypes = {
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

function identity(x) {
  return x;
}

var map = Array.prototype.map,
    prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function formatLocale(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "-" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision === undefined ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;

        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

var locale;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

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
    formatter = formatPrefix('.0', 1e3);
  } else if (max >= 1000) {
    formatter = format('.3s');
  } else {
    formatter = format('.3~r');
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

// Accumulate values
const flatArr = n => {
  let rslt;
  if(Array.isArray(n)){
    rslt = [].concat.apply([],n); 
  }else{
    rslt = [n];
  }
  return rslt
};

// Unlike Ramda or lodash, these will transform input to array
const append = R__default.curry((arg1,arg2) => {
  var argarr = flatArr(arg2);
  var rslt = [].concat.apply([], [argarr, arg1]);
  return rslt
});

const prepend = R__default.curry((arg1,arg2) => {
  var argarr = flatArr(arg2);
  var rslt = [].concat.apply([], [arg1, argarr]);
  return rslt
});

// Append using function call with arg
const appendUseNth = R__default.curry((n,fn,args) => {
  var argarr = flatArr(args);
  var rslt = fn(argarr[n]);
  rslt = [].concat(argarr, rslt);
  return flatArr(rslt)
});

const prependUseNth = R__default.curry((n,fn,args) => {
  var argarr = flatArr(args);
  var rslt = fn(argarr[n]);
  rslt = [].concat(rslt, argarr);
  return flatArr(rslt)
});

const insertUseNth = R__default.curry((n,ins,fn,args) => {
  var argarr = flatArr(args);
  var rslt = fn(argarr[n]);
  rslt = R__default.insert(ins, rslt, argarr);
  return flatArr(rslt)
});

// Call function will all accumulated args
const runAll = R__default.curry((fn,argarr) => argarr.reduce((partFn, curr) => partFn(curr), fn));

// Calls function with correct arity with # args specified from end of arr. 
const runN = R__default.curry((n,fn,argarr) => {
  let args = argarr.slice(argarr.length - n);
  let rslt = args.reduce((partFn, curr) => {
    return partFn(curr)
  },fn);
  return rslt
});

// Act on arrays in a function Pipe
var append_1 = append;
var prepend_1 = prepend;
var appendUseNth_1 = appendUseNth;
var prependUseNth_1 = prependUseNth;
var insertUseNth_1 = insertUseNth;
var runAll_1 = runAll;
var runN_1 = runN;

var arrayfcn = {
	append: append_1,
	prepend: prepend_1,
	appendUseNth: appendUseNth_1,
	prependUseNth: prependUseNth_1,
	insertUseNth: insertUseNth_1,
	runAll: runAll_1,
	runN: runN_1
};

const concat = R__default.curry((addon,existing) => (existing.concat(addon)));

const strSearchBool = R__default.curry((regex, str) => (str.search(regex) > -1 ));

const strRemoveSpecial = str => str.replace(/[-\/\\^$*+?.()|[\]{}]/g,'');

const regexEscapeAll = str => str.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');

const regexEscapeExPer = str => str.replace(/[-\/\\^$*+?()|[\]{}]/g,'\\$&');

const toRegex = R__default.curry((flags,str) => (new RegExp(str, flags)));

const getRegex = R__default.pipe(
  regexEscapeExPer,
  toRegex('i'),
);

const getSearch = R__default.pipe(
  strRemoveSpecial,
  R__default.toLower,
  R__default.replace(/ /g,''),
);

var concat_1 = concat;
var strSearchBool_1 = strSearchBool;
var strRemoveSpecial_1 = strRemoveSpecial;
var regexEscapeAll_1 = regexEscapeAll;
var regexEscapeExPer_1 = regexEscapeExPer;
var toRegex_1 = toRegex;
var getRegex_1 = getRegex;
var getSearch_1 = getSearch;

var strings = {
	concat: concat_1,
	strSearchBool: strSearchBool_1,
	strRemoveSpecial: strRemoveSpecial_1,
	regexEscapeAll: regexEscapeAll_1,
	regexEscapeExPer: regexEscapeExPer_1,
	toRegex: toRegex_1,
	getRegex: getRegex_1,
	getSearch: getSearch_1
};

const {strSearchBool: strSearchBool$1} = strings;

const isTypeof = R__default.curry((type,input) => (R__default.toLower(R__default.type(input)) === R__default.toLower(type)));

const typeMatch = R__default.curry((inputA,inputB) => {
 return R__default.type(inputA) === R__default.type(inputB)
});

const toJSON = input => JSON.parse(input);

const strToNum = input => {
  if((typeof(input) === "string") && strSearchBool$1(/^[0-9\.]+$/)(input)){
    return (Number(input))
  }
  return input; 
};

const toDate = input => {
  return (new Date(input))
};

const toArray = input => {
  return Array.isArray(input) ? input : Array.of(input)
};

var isTypeof_1 = isTypeof;
var typeMatch_1 = typeMatch;
var toJSON_1 = toJSON;
var strToNum_1 = strToNum;
var toDate_1 = toDate;
var toArray_1 = toArray;

var conversions = {
	isTypeof: isTypeof_1,
	typeMatch: typeMatch_1,
	toJSON: toJSON_1,
	strToNum: strToNum_1,
	toDate: toDate_1,
	toArray: toArray_1
};

const consoleLog = statement => console.log(statement);
const consoleWarn = statement => console.warn(statement);
const consoleErr = statement => console.error(statement);

const trace = R__default.curry((label,value) => {
  console.log(`${ label }: ${ value }`);
  return value;
});

const tracePretty = R__default.curry((label,value) => {
  var visualize = JSON.stringify(value, null, 2);
  console.log(`${ label }: ${ visualize }`);
  return value;
});

const errorIf = R__default.curry((testfcn,input) => { 
  if(testfcn(input)){
    throw new Error("Input contained error value: " + JSON.stringify(input))
  }else{
    return input
  }
});

var trace_1 = trace;
var tracePretty_1 = tracePretty;
var consoleLog_1 = consoleLog;
var consoleWarn_1 = consoleWarn;
var consoleErr_1 = consoleErr;
var errorIf_1 = errorIf;

var logging = {
	trace: trace_1,
	tracePretty: tracePretty_1,
	consoleLog: consoleLog_1,
	consoleWarn: consoleWarn_1,
	consoleErr: consoleErr_1,
	errorIf: errorIf_1
};

const divide = R__default.curry((denom,numerate) => (numerate / denom));
const subtract = R__default.curry((minus,input) => (input - minus));

var divide_1 = divide;
var subtract_1 = subtract;

var math = {
	divide: divide_1,
	subtract: subtract_1
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

const pipeAsync = (...fns) => x => fns.reduce(async (state, fn) => {
  var curr = fn(await state);
  if(Array.isArray(curr)){ 
    return await Promise.all(curr); 
  }else{ 
    return await curr; 
  } }, commonjsGlobal.Promise.resolve(x));

var pipeAsync_2 = pipeAsync;

var pipeAsync_1 = {
	pipeAsync: pipeAsync_2
};

let combine;
combine = {...combine,...arrayfcn};
combine = {...combine,...conversions};
combine = {...combine,...logging};
combine = {...combine,...math};
combine = {...combine,...pipeAsync_1};
combine = {...combine,...strings};
var fpstreamline = combine;

var passprops = function passprops(pass, children) {
  if (!children) {
    return undefined;
  }

  var propsToChildren = R.map(function (child) {
    return React__default.cloneElement(child, _objectSpread2({}, pass));
  })(fpstreamline.toArray(children));
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
  })(fpstreamline.toArray(props.children));
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
