import React from "react";
import _ from "lodash";

// If you don't override the render components,
// we have convenient defaults
export const defaultRenderers = {
  loading: () => <div>Loading</div>,
  error: ({ error, sendRequest }) => (
    <div>Error in API response: {error.toString()} </div>
  ),
  loaded: ({ response }) => <pre>{JSON.stringify(response, null, 2)}</pre>,
  debug: () => <div>DEBUG=true set but no debug component specified</div>
};

export default (options, response, render) => {
  render = { ...defaultRenderers, ...options.render, ...render };
  const withDebug = main =>
    options.debug ? (
      <React.Fragment>
        {main}
        {render.debug({ ...response })}
      </React.Fragment>
    ) : (
      main
    );
  if (!response || _.isEmpty(response)) return withDebug(render.loading());
  if (response.error) return withDebug(render.error(response));
  if (response.data) return withDebug(render.loaded(response));
  return <div>RenderAsyncComponent never got any anything?</div>;
};
