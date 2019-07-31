import React from "react";

// If you don't override the render components,
// we have convenient defaults
export const defaultRenderers = {
  loading: () => <div>Loading</div>,
  error: ({ error }) => (
    <div>Error in API response:<br /><pre>{error.toString()}</pre></div>
  ),
  loaded: ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>,
};

export default (input, render) => {
  if (typeof render === "function") render = { loaded: render };

  render = { ...defaultRenderers, ...render };

  const response = input.response && input.response.data ? input.response : input

  if (response.error) return render.error(response);
  if (response.data) return render.loaded(response);
  if (!response.startTime || !response || !response.data) render.loading();
  console.warn(`AsyncComponent Error: No content to show for ${response.method} ${response.url}, there may have been a problem with an AJAX request`)
  return null;
};
