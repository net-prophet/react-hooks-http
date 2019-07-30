import React from "react";
import _ from "lodash";

export default function DRFObject(api, model, id, Component) {
  const url = model + "/" + id + "/";
  const options = api.useOPTIONS(model + "/");
  const details = api.useGET(url);
  const update = api.usePUT(url);

  options.requestOnce();
  details.requestOnce();

  return api.AsyncComponent(options.response, option_response =>
    api.AsyncComponent(details.response, detail_response => {
      const data = detail_response.data;

      // Build a form fields
      const fields = { items: option_response.data.actions.POST };

      fields.input_mapping = {
        boolean: "checkbox"
      };
      fields.field_cast = {
        boolean: val => val === true
      };

      fields.type = key => fields.fields[key].type;
      fields.cast = (key, value) =>
        fields.field_cast[fields.type(key)]
          ? fields.field_cast[fields.type(key)](value)
          : value;
      fields.submit = optional_data => update.sendRequest(optional_data);
      fields.populateFromDetails = () => {
        !_.isEmpty(data) && _.isEmpty(update.form) && update.setForm(data);
      };

      const props = {
        url,
        options,
        details,
        update,
        fields,
        data
      };

      return <Component {...props} />;
    })
  );
}
