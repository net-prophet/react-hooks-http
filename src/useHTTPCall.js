import React, { useEffect, useState } from "react";
import _ from "lodash";

const GetResponseJSON = response => {
  return new Promise((resolve, reject) =>
    response
      .json()
      .then(json =>
        resolve({
          response,
          json
        })
      )
      .catch(reject)
  );
};

const makeOptions = options => {
  if (!options) options = {};
  if (!options.headers) options.headers = {};
  if (!options.headers["Content-Type"])
    options.headers["Content-Type"] = "application/json;charset=UTF-8";
  return {
    method: "GET",
    get_instantly: true,
    debug: false,
    ...options
  };
};

export default function useHTTPCall(url, opt = null) {
  const options = makeOptions(opt);
  const [body, setBody] = useState();
  let form = {};
  const [startTime, setStartTime] = useState();

  const [response, setResponse] = useState({
    data: null,
    pending: false,
    loaded: false,
    error: null,
    loadTime: null,
    elapsed: null,
    url,
    options
  });

  const sendRequest = form_data => {
    setStartTime(new Date());
    setBody(form_data ? form_data : form);
    setResponse({ ...response, pending: true });
  };

  useEffect(() => {
    if (!startTime) return;
    const debug = options.debug ? console.debug : () => null;
    let sendBody;
    if (options.method !== "GET" && !_.isEmpty(body)) sendBody = body;
    debug("Sending HTTP body:", options.method, url, sendBody);
    fetch(url, {
      method: options.method,
      headers: options.headers,
      body: sendBody && JSON.stringify(sendBody)
    })
      .then(GetResponseJSON)
      .then(output => {
        const loadTime = new Date();
        const elapsed = loadTime.getTime() - startTime.getTime();
        const error = options.checkErrors
          ? options.checkErrors(output.response, output.json)
          : null;
        setResponse({
          ...response,
          loadTime,
          elapsed,
          data: !error && output.json,
          pending: false,
          loaded: true,
          error
        });
        debug(
          "Got HTTP reply:",
          options.method,
          url,
          elapsed + "ms",
          output.json
        );
      })
      .catch(error => {
        setResponse({ ...response, error, pending: false });
      });
  }, [startTime]);

  const requestOnce = () =>
    !response.startTime &&
    !response.pending &&
    !response.loaded &&
    sendRequest();

  const setField = (key, event, prop = "value") => {
    event.persist();
    form[key] = event.target[prop];
  };
  const setForm = value => (form = value);

  return {
    response,
    sendRequest,
    requestOnce,
    form,
    setForm,
    setField
  };
}
