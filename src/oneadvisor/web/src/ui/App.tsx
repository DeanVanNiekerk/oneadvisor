import { ConnectedRouter } from "connected-react-router";
import React from "react";
import FullStory from "react-fullstory";
import { Provider } from "react-redux";
import RenderInBrowser from "react-render-in-browser";

import { getStore, history } from "@/state/configureStore";

import BrowserNotSupported from "./layout/BrowserNotSupported";
import Startup from "./layout/Startup";
import Routes from "./routes/Routes";

const { store } = getStore();

const App: React.FC = () => {
    return (
        <>
            <FullStory org={__FULLSTORY_KEY__} />
            <RenderInBrowser chrome firefox edge only>
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <Startup>
                            <Routes />
                        </Startup>
                    </ConnectedRouter>
                </Provider>
            </RenderInBrowser>
            <RenderInBrowser chrome firefox edge except>
                <BrowserNotSupported />
            </RenderInBrowser>
        </>
    );
};

export default App;
