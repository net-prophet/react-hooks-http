import React, { useState } from "react";
import TimeAgo from "react-timeago";
import JSONTree from "react-json-tree";

export default ({response, sendRequest, form}) => {
  const [show, setShow] = useState(false);

  return (
    <pre>
      <hr />
      <div style={{ background: "rgba(0,0,0,0.2)", padding: '0.5em'}}>
        <div style={{ float: "right" }}>
          {response.count ? 
            <React.Fragment>
                {response.elapsed} ms {
                    response.loadTime ? <TimeAgo date={response.loadTime} /> : null}
                <br />
                {response.count} requests total
            </React.Fragment>
            : null }
        </div>
        <h3>
          {response.options && response.options.method} {response.url}
        </h3>
        <br />
        <button onClick={() => setShow(show === "response" ? null : "response")}>
          Show Response
        </button>
        { response.options && response.options.method !== 'GET' ?
            <React.Fragment>
            <button onClick={() => setShow(show === "form" ? null : "form")}>
                Show Form Body
            </button>
            </React.Fragment>
        : null }
        <button style={{float: 'right'}} onClick={() => sendRequest()}>
          Send HTTP Request
        </button>
        {show === "response" && <JSONTree data={response} />}
        {show === "form" && <JSONTree data={form} />}
      </div>
    </pre>
  );
};
