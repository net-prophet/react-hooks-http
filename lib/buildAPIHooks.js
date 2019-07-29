"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _useHTTPCall = require("./useHTTPCall");

var _useHTTPCall2 = _interopRequireDefault(_useHTTPCall);

var _RenderAsyncComponent = require("./RenderAsyncComponent");

var _RenderAsyncComponent2 = _interopRequireDefault(_RenderAsyncComponent);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (base_url) {
  var base_options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var render_api = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var useAPI = function useAPI(stub, options) {
    return (0, _useHTTPCall2.default)(base_url + stub, _extends({}, base_options, options));
  };

  var AsyncComponent = function AsyncComponent(response, render, options) {
    if (typeof render === "function") render = { loaded: render };
    var merged_options = _lodash2.default.merge({}, base_options, options);
    var merged_render = _lodash2.default.merge({}, render_api, render);
    return (0, _RenderAsyncComponent2.default)(merged_options, response, merged_render);
  };

  return {
    useAPI: useAPI,
    useGET: function useGET(stub, options) {
      return useAPI(stub, options);
    },
    usePOST: function usePOST(stub, options) {
      return useAPI(stub, _extends({}, options, { method: "POST" }));
    },
    useOPTIONS: function useOPTIONS(stub, options) {
      return useAPI(stub, _extends({}, options, { method: "OPTIONS" }));
    },
    usePUT: function usePUT(stub, options) {
      return useAPI(stub, _extends({}, options, { method: "PUT" }));
    },
    usePATCH: function usePATCH(stub, options) {
      return useAPI(stub, _extends({}, options, { method: "PATCH" }));
    },
    AsyncComponent: AsyncComponent
  };
};