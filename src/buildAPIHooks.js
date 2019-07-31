import React from 'react';
import useHTTPCall from "./useHTTPCall";
import RenderAsyncComponent from "./RenderAsyncComponent";

export default (base_url, api_options = null, api_views = null) => {
  const useAPI = (stub, options) =>
    useHTTPCall(base_url + stub, { ...api_options, ...options });

  const Component = (hook, views) => {
    if(React.isValidElement(views) || typeof views === 'function')
        views = { loaded: views }
    const _views = {...api_views, ...views}
    console.log(_views)
    const rendered = RenderAsyncComponent(hook.response, _views);
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
