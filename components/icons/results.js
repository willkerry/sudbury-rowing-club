const React = require("react");

function Results(props) {
  return /* #__PURE__ */ React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      ...props,
    },
    /* #__PURE__ */ React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M6 3l-.5 18m13 0L18 3M6 7h12M6 11h12m0-6h3a2 2 0 012 2v6a2 2 0 01-2 2h-2.5M5 3h14M4.5 21h15",
    })
  );
}

module.exports = Results;
