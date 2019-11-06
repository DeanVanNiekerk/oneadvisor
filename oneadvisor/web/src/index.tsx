import "@/ui/styles";

import { ConnectedRouter } from "connected-react-router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { configureStore, history } from "@/state/configureStore";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

if (__APP_INSIGHTS_KEY__ != "") {
    const reactPlugin = new ReactPlugin();
    const appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: __APP_INSIGHTS_KEY__,
            extensions: [reactPlugin],
            extensionConfig: {
                [reactPlugin.identifier]: { history: history },
            },
        },
    });
    appInsights.loadAppInsights();
}

const store = configureStore();

// Save a reference to the root element for reuse
const rootElement = document.getElementById("root");

// Create a reusable render method that we can call more than once
let render = () => {
    // Dynamically import our main App component, and render it
    const App = require("./ui/layout/App").default;

    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>,
        rootElement
    );
};

if (module.hot) {
    // Support hot reloading of components.
    // Whenever the App component file or one of its dependencies
    // is changed, re-import the updated component and re-render it
    module.hot.accept("./ui/layout/App", () => {
        setTimeout(render);
    });
}

render();
