import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import buildAPIHooks from "./buildAPIHooks";
import DebugRequestPanel from "./DebugRequestPanel";
import _ from "lodash";
import DRFObject from "./DRFObject";

const api = buildAPIHooks(
  "",
  {
    headers: { Authorization: "Token blahblahblahasdfdeadbeef" },
    checkErrors: (r, json) => json.detail === "Not found." && "Not found.",
    debug: true
  },
  {
    loading: () => <div>OVERRIDE THE LOADING MESSAGE</div>,
    debug: request => <DebugRequestPanel {...request} />
  }
);

function App() {
  return DRFObject(
    api,
    "subscriptions",
    "44fa01b2",

    ({ details, data, update, fields }) => {
      if (_.isEmpty(data)) return null;
      fields.populateFromDetails();
      return (
        <div>
          Got object #{data.id} from Subscription API
          {_.map(fields.items, (field, key) => (
            <React.Fragment key={key}>
              <div>
                <input
                  defaultValue={data[key]}
                  checked={field.type === "boolean" ? data[key] : null}
                  disabled={field.read_only}
                  onChange={e => update.setField(key, e)}
                  id={key}
                />
                <label htmlFor={key}>
                  {field.label}
                  {field.required ? (
                    <span style={{ color: "red" }}>*</span>
                  ) : null}
                </label>
              </div>
            </React.Fragment>
          ))}
          <button onClick={() => update.sendRequest()}>Save</button>
          <button onClick={() => details.sendRequest()}>Reload Details</button>
          {details.response.pending ? "Refreshing..." : null}
          {update.response.pending ? "Submitting..." : null}
          {update.response.loaded
            ? api.AsyncComponent(update.response, () => <div>Saved!</div>)
            : null}
        </div>
      );
    }
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
