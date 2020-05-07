import { ConnectedRouter } from "connected-react-router";
import React from "react";
import FullStory from "react-fullstory";
import { Provider } from "react-redux";

import { getStore, history } from "@/state/configureStore";

import Startup from "./layout/Startup";
import Routes from "./routes/Routes";

const { store } = getStore();

const App: React.FC = () => {
    return (
        <>
            <FullStory org={__FULLSTORY_KEY__} />
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Startup>
                        <Routes />
                    </Startup>
                </ConnectedRouter>
            </Provider>
        </>
    );
};

export default App;
