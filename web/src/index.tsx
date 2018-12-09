import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { configureStore, history } from '@/state/configureStore';
import "@/ui/styles";

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

if(module.hot) {
    // Support hot reloading of components.
    // Whenever the App component file or one of its dependencies
    // is changed, re-import the updated component and re-render it
    module.hot.accept("./ui/layout/App", () => {
        setTimeout(render);
    });
}

render();