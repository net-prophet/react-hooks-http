"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _buildAPIHooks = require("./buildAPIHooks");

var _buildAPIHooks2 = _interopRequireDefault(_buildAPIHooks);

var _DebugRequestPanel = require("./DebugRequestPanel");

var _DebugRequestPanel2 = _interopRequireDefault(_DebugRequestPanel);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _DRFObject = require("./DRFObject");

var _DRFObject2 = _interopRequireDefault(_DRFObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = (0, _buildAPIHooks2.default)("", {
  headers: { Authorization: "Token blahblahblahasdfdeadbeef" },
  checkErrors: function checkErrors(r, json) {
    return json.detail === "Not found." && "Not found.";
  },
  debug: true
}, {
  loading: function loading() {
    return _react2.default.createElement(
      "div",
      null,
      "OVERRIDE THE LOADING MESSAGE"
    );
  },
  debug: function debug(request) {
    return _react2.default.createElement(_DebugRequestPanel2.default, request);
  }
});

function App() {
  return (0, _DRFObject2.default)(api, "subscriptions", "44fa01b2", function (_ref) {
    var details = _ref.details,
        data = _ref.data,
        update = _ref.update,
        fields = _ref.fields;

    if (_lodash2.default.isEmpty(data)) return null;
    fields.populateFromDetails();
    return _react2.default.createElement(
      "div",
      null,
      "Got object #",
      data.id,
      " from Subscription API",
      _lodash2.default.map(fields.items, function (field, key) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          { key: key },
          _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement("input", {
              defaultValue: data[key],
              checked: field.type === "boolean" ? data[key] : null,
              disabled: field.read_only,
              onChange: function onChange(e) {
                return update.setField(key, e);
              },
              id: key
            }),
            _react2.default.createElement(
              "label",
              { htmlFor: key },
              field.label,
              field.required ? _react2.default.createElement(
                "span",
                { style: { color: "red" } },
                "*"
              ) : null
            )
          )
        );
      }),
      _react2.default.createElement(
        "button",
        { onClick: function onClick() {
            return update.sendRequest();
          } },
        "Save"
      ),
      _react2.default.createElement(
        "button",
        { onClick: function onClick() {
            return details.sendRequest();
          } },
        "Reload Details"
      ),
      details.response.pending ? "Refreshing..." : null,
      update.response.pending ? "Submitting..." : null,
      update.response.loaded ? api.AsyncComponent(update.response, function () {
        return _react2.default.createElement(
          "div",
          null,
          "Saved!"
        );
      }) : null
    );
  });
}

var rootElement = document.getElementById("root");
_reactDom2.default.render(_react2.default.createElement(App, null), rootElement);