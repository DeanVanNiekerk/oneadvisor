import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/index.css";

import React from "react";
import ReactDOM from "react-dom";

import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

if (__APP_INSIGHTS_KEY__ != "") {
    const reactPlugin = new ReactPlugin();
    const appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: __APP_INSIGHTS_KEY__,
            extensions: [reactPlugin],
        },
    });
    appInsights.loadAppInsights();
}

// Save a reference to the root element for reuse
const rootElement = document.getElementById("root");

// Create a reusable render method that we can call more than once
let render = () => {
    // Dynamically import our main App component, and render it
    const App = require("./App").default;

    ReactDOM.render(<App />, rootElement);
};

if (module.hot) {
    // Support hot reloading of components.
    // Whenever the App component file or one of its dependencies
    // is changed, re-import the updated component and re-render it
    module.hot.accept("./App", () => {
        setTimeout(render);
    });
}

render();
