import { connectRouter } from "connected-react-router";
import { History } from "history";

import { reducer as auth } from "./auth/reducer";
import { reducer as context } from "./context/reducer";

const createStaticReducers = (history: History) => {
    return {
        context: context,
        auth: auth,
        router: connectRouter(history),
    };
};

export default createStaticReducers;
