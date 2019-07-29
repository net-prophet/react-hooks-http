"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = useHTTPCall;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GetResponseJSON = function GetResponseJSON(response) {
  return new Promise(function (resolve, reject) {
    return response.json().then(function (json) {
      return resolve({
        response: response,
        json: json
      });
    }).catch(reject);
  });
};

var makeOptions = function makeOptions(options) {
  if (!options) options = {};
  if (!options.headers) options.headers = {};
  if (!options.headers["Content-Type"]) options.headers["Content-Type"] = "application/json;charset=UTF-8";
  return _extends({
    method: "GET",
    get_instantly: true,
    debug: false
  }, options);
};

function useHTTPCall(url) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var options = makeOptions(opt);

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      body = _useState2[0],
      setBody = _useState2[1];

  var form = {};

  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      startTime = _useState4[0],
      setStartTime = _useState4[1];

  var _useState5 = (0, _react.useState)({
    data: null,
    pending: false,
    loaded: false,
    error: null,
    loadTime: null,
    elapsed: null,
    url: url,
    options: options
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      response = _useState6[0],
      setResponse = _useState6[1];

  var sendRequest = function sendRequest(form_data) {
    setStartTime(new Date());
    setBody(form_data ? form_data : form);
    setResponse(_extends({}, response, { pending: true }));
  };

  (0, _react.useEffect)(function () {
    if (!startTime) return;
    var debug = options.debug ? console.debug : function () {
      return null;
    };
    var sendBody = void 0;
    if (options.method !== "GET" && !_lodash2.default.isEmpty(body)) sendBody = body;
    debug("Sending HTTP body:", options.method, url, sendBody);
    fetch(url, {
      method: options.method,
      headers: options.headers,
      body: sendBody && JSON.stringify(sendBody)
    }).then(GetResponseJSON).then(function (output) {
      var loadTime = new Date();
      var elapsed = loadTime.getTime() - startTime.getTime();
      var error = options.checkErrors ? options.checkErrors(output.response, output.json) : null;
      setResponse(_extends({}, response, {
        loadTime: loadTime,
        elapsed: elapsed,
        data: !error && output.json,
        pending: false,
        loaded: true,
        error: error
      }));
      debug("Got HTTP reply:", options.method, url, elapsed + "ms", output.json);
    }).catch(function (error) {
      setResponse(_extends({}, response, { error: error, pending: false }));
    });
  }, [startTime]);

  var requestOnce = function requestOnce() {
    return !response.startTime && !response.pending && !response.loaded && sendRequest();
  };

  var setField = function setField(key, event) {
    var prop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "value";

    event.persist();
    form[key] = event.target[prop];
  };
  var setForm = function setForm(value) {
    return form = value;
  };

  return {
    response: response,
    sendRequest: sendRequest,
    requestOnce: requestOnce,
    form: form,
    setForm: setForm,
    setField: setField
  };
}