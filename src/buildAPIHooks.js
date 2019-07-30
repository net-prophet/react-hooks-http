import useHTTPCall from "./useHTTPCall";
import RenderAsyncComponent from "./RenderAsyncComponent";
import _ from "lodash";

export default (base_url, base_options = null, render_api = null) => {
  const useAPI = (stub, options) =>
    useHTTPCall(base_url + stub, { ...base_options, ...options });

  const AsyncComponent = (response, render, options) => {
    const merged_render = _.merge({}, render_api, render);
    const merged_options = _.merge({}, base_options, options);
    return RenderAsyncComponent(response, merged_render, merged_options);
  };

  return {
    useAPI,
    useGET: (stub, options) => useAPI(stub, options),
    usePOST: (stub, options) => useAPI(stub, { ...options, method: "POST" }),
    useOPTIONS: (stub, options) =>
      useAPI(stub, { ...options, method: "OPTIONS" }),
    usePUT: (stub, options) => useAPI(stub, { ...options, method: "PUT" }),
    usePATCH: (stub, options) => useAPI(stub, { ...options, method: "PATCH" }),
    AsyncComponent
  };
};
