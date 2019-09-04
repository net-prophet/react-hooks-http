import React, { useEffect, useState } from "react";

// If you don't override the render components,
// we have convenient defaults
export const defaultRenderers = {
  loading: () => <div>Loading</div>,
  error: ({ error }) => (
    <div>Error in API response:<br /><pre>{error.toString()}</pre></div>
  ),
  loaded: ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>
};

export const AsyncComponent = (hook, render) => {
  if (typeof render === "function") render = { loaded: render };

  render = { ...defaultRenderers, ...render };

  if (hook.response.error) return render.error(hook.response);
  if (hook.response.data) return render.loaded(hook.response);
  if (!hook.response.startTime || !hook.response || !hook.response.data)
    return render.loading(hook.response);
  console.warn(`AsyncComponent Error: No content to show for ${hook.response.method} ${hook.response.url}, there may have been a problem with an AJAX request`)
  return null;
};

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
    retry_failure: false,
    debug: false,
    limit_per_second: 0.5,
    ...options
  };
};

export function useHTTPCall(url, opt = null) {
  const options = makeOptions(opt);
  options.method = options.method.toUpperCase(); // important that it be capitalized

  const [body, setBody] = useState();
  let form = {};
  const [startTime, setStartTime] = useState();

  const [response, setResponse] = useState({
    data: null,
    pending: false,
    loaded: false,
    count: 0,
    created: new Date().getTime(),
    error: null,
    loadTime: null,
    elapsed: null,
    url,
    options
  });

  const sendRequest = form_data => {
    if(response.pending) return;
    const hookAge = (new Date().getTime() - response.created)/1000;
    const sinceLast = (new Date().getTime() - startTime)/1000;
    if(response.count > options.limit_per_second*hookAge ||
        sinceLast < 1/options.limit_per_second)
    {
      console.warn('react-hooks-http rate limit exceeded for', url)
      return;
    }
    setStartTime(new Date());
    setBody(form_data ? form_data : form);
    setResponse((r) => ({ ...r, count: r.count+1, pending: true }));
 };

  useEffect(() => {
    if (!startTime) return;
    if(response.error && !options.retry_failure)
    {
      return;
    }
    const debug = options.debug ? console.debug : () => null;
    let sendBody;
    if (options.method !== "GET" && (!body || !body.length)) sendBody = body;
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
    !(response.error && !options.retry_failure) &&
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

export const buildAPIHooks = (base_url, api_options = null, api_views = null) => {
  const useAPI = (stub, options) =>
    useHTTPCall(base_url + stub, { ...api_options, ...options });

  const Component = (hook, views) => {
    if(React.isValidElement(views) || typeof views === 'function')
        views = { loaded: views }
    const _views = {...api_views, ...views}
    console.log(_views)
    const rendered = AsyncComponent(hook, _views);
    return <React.Fragment>
            {rendered}
            {api_options.debug && _views.debug ? _views.debug(hook) : null}
        </React.Fragment>
  };

  return {
    useAPI,
    useGET: (stub, options) => useAPI(stub, options),
    usePOST: (stub, options) => useAPI(stub, { ...options, method: "POST" }),
    useOPTIONS: (stub, options) =>
      useAPI(stub, { ...options, method: "OPTIONS" }),
    usePUT: (stub, options) => useAPI(stub, { ...options, method: "PUT" }),
    usePATCH: (stub, options) => useAPI(stub, { ...options, method: "PATCH" }),
    Component
  };
};
