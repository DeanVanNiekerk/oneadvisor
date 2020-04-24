import { connectRouter } from "connected-react-router";
import { History } from "history";

import { reducer as auth } from "./auth/reducer";
import { reducer as context } from "./context/reducer";
import { reducer as lookups } from "./lookups/reducer";

const createStaticReducers = (history: History) => {
    return {
        context: context,
        auth: auth,
        lookups: lookups,
        router: connectRouter(history),
    };
};

export default createStaticReducers;
