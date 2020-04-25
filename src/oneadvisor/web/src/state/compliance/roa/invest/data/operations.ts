import { AnyAction, Dispatch as DispatchRedux } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { getClient } from "@/state/lookups/client";
import { RootState } from "@/state/types";

import { receiveData, receiveFetching, roaInvestInputsSelector } from "../";
import { RoaInvestDataAction } from "./";
import { RoaInvestData } from "./types";

type Dispatch = ThunkDispatch<RootState, {}, AnyAction>;

const getClientFullName = (dispatch: Dispatch, clientId: string | null): Promise<string> => {
    let clientFullName = "";

    if (!clientId) return Promise.resolve(clientFullName);

    return new Promise<string>((resolve) => {
        dispatch(
            getClient(
                clientId,
                //Success
                (client) => {
                    clientFullName = `${client.firstName ? client.firstName : ""} ${
                        client.lastName
                    }`;
                },
                //Always
                () => {
                    resolve(clientFullName);
                }
            )
        );
    });
};

export const loadRoaInvestData = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        dispatch(receiveFetching(true));

        const inputs = roaInvestInputsSelector(getState());

        getClientFullName(dispatch, inputs.clientId).then((clientFullName) => {
            const data: RoaInvestData = {
                clientFullName: clientFullName,
                consultReason: inputs.consultReason,
            };

            dispatch(receiveData(data));

            dispatch(receiveFetching(false));
        });
    };
};
