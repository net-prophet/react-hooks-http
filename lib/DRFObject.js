"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DRFObject;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DRFObject(api, model, id, Component) {
  var url = model + "/" + id + "/";
  var options = api.useOPTIONS(model + "/");
  var details = api.useGET(url);
  var update = api.usePUT(url);

  options.requestOnce();
  details.requestOnce();

  return api.AsyncComponent(options.response, function (option_response) {
    return api.AsyncComponent(details.response, function (detail_response) {
      var data = detail_response.data;

      // Build a form fields
      var fields = { items: option_response.data.actions.POST };

      fields.input_mapping = {
        boolean: "checkbox"
      };
      fields.field_cast = {
        boolean: function boolean(val) {
          return val === true;
        }
      };

      fields.type = function (key) {
        return fields.fields[key].type;
      };
      fields.cast = function (key, value) {
        return fields.field_cast[fields.type(key)] ? fields.field_cast[fields.type(key)](value) : value;
      };
      fields.submit = function (optional_data) {
        return update.sendRequest(optional_data);
      };
      fields.populateFromDetails = function () {
        !_lodash2.default.isEmpty(data) && _lodash2.default.isEmpty(update.form) && update.setForm(data);
      };

      var props = {
        url: url,
        options: options,
        details: details,
        update: update,
        fields: fields,
        data: data
      };

      return _react2.default.createElement(Component, props);
    });
  });
}