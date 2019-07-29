"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTimeago = require("react-timeago");

var _reactTimeago2 = _interopRequireDefault(_reactTimeago);

var _reactJsonTree = require("react-json-tree");

var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      show = _useState2[0],
      setShow = _useState2[1];

  return _react2.default.createElement(
    "pre",
    null,
    _react2.default.createElement("hr", null),
    _react2.default.createElement(
      "div",
      { style: { background: "rgba(0,0,0,0.2)" } },
      _react2.default.createElement(
        "div",
        { style: { float: "right" } },
        props.elapsed,
        " ms",
        _react2.default.createElement("br", null),
        props.loadTime ? _react2.default.createElement(_reactTimeago2.default, { date: props.loadTime }) : null
      ),
      _react2.default.createElement(
        "h3",
        null,
        props.options && props.options.method,
        " ",
        props.url
      ),
      _react2.default.createElement(
        "button",
        { onClick: function onClick() {
            return setShow(show === "props" ? null : "props");
          } },
        "Show Props"
      ),
      show === "props" && _react2.default.createElement(_reactJsonTree2.default, { data: props })
    )
  );
};