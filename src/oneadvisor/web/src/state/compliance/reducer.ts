import { State } from "./types";

export const defaultState = {
    fetching: "WORKING!",
};

export const reducer = (state: State = defaultState) => {
    return state;
};
