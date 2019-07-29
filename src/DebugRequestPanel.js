import React, { useState, useEffect } from "react";
import TimeAgo from "react-timeago";
import JSONTree from "react-json-tree";

export default props => {
  const [show, setShow] = useState(false);

  return (
    <pre>
      <hr />
      <div style={{ background: "rgba(0,0,0,0.2)" }}>
        <div style={{ float: "right" }}>
          {props.elapsed} ms
          <br />
          {props.loadTime ? <TimeAgo date={props.loadTime} /> : null}
        </div>
        <h3>
          {props.options && props.options.method} {props.url}
        </h3>
        <button onClick={() => setShow(show === "props" ? null : "props")}>
          Show Props
        </button>
        {show === "props" && <JSONTree data={props} />}
      </div>
    </pre>
  );
};
