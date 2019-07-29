"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultRenderers = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// If you don't override the render components,
// we have convenient defaults
var defaultRenderers = {
  loading: function loading() {
    return _react2.default.createElement(
      "div",
      null,
      "Loading"
    );
  },
  error: function error(_ref) {
    var _error = _ref.error,
        sendRequest = _ref.sendRequest;
    return _react2.default.createElement(
      "div",
      null,
      "Error in API response: ",
      _error.toString(),
      " "
    );
  },
  loaded: function loaded(_ref2) {
    var response = _ref2.response;
    return _react2.default.createElement(
      "pre",
      null,
      JSON.stringify(response, null, 2)
    );
  },
  debug: function debug() {
    return _react2.default.createElement(
      "div",
      null,
      "DEBUG=true set but no debug component specified"
    );
  }
};

exports.defaultRenderers = defaultRenderers;

exports.default = function (options, response, render) {
  render = _extends({}, defaultRenderers, options.render, render);
  var withDebug = function withDebug(main) {
    return options.debug ? _react2.default.createElement(
      _react2.default.Fragment,
      null,
      main,
      render.debug(_extends({}, response))
    ) : main;
  };
  if (!response || _lodash2.default.isEmpty(response)) return withDebug(render.loading());
  if (response.error) return withDebug(render.error(response));
  if (response.data) return withDebug(render.loaded(response));
  return _react2.default.createElement(
    "div",
    null,
    "RenderAsyncComponent never got any anything?"
  );
};