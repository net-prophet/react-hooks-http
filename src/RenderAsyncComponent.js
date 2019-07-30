import React from "react";
import _ from "lodash";

// If you don't override the render components,
// we have convenient defaults
export const defaultRenderers = {
  loading: () => <div>Loading</div>,
  error: ({ error, sendRequest }) => (
    <div>Error in API response: {error.toString()} </div>
  ),
  loaded: ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>,
  debug: () => <div>DEBUG=true set but no debug component specified</div>
};

export default (input, render, options) => {
  if (typeof render === "function") render = { loaded: render };

  render = { ...defaultRenderers, ...render };

  const response = input.response && input.response.data ? input.response : input

  const withDebug = main =>
    options.debug ? (
      <React.Fragment>
        {main}
        {render.debug({ ...response })}
      </React.Fragment>
    ) : (
      main
    );
  if (response.error) return withDebug(render.error(response));
  if (_.isEmpty(response) || !response.data) return withDebug(render.loading());
  if (response.data) return withDebug(render.loaded(response));
  return <div>RenderAsyncComponent never got any anything?</div>;
};
