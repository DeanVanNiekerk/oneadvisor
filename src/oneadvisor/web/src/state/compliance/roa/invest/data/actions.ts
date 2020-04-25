import { RoaInvestData } from "./types";

type RoaInvestDataFetchingReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_DATA_FETCHING_RECEIVE";
    payload: boolean;
};

type RoaInvestDataReceiveAction = {
    type: "COMPLIANCE_ROA_INVEST_DATA_RECEIVE";
    payload: RoaInvestData;
};

export type RoaInvestDataAction = RoaInvestDataFetchingReceiveAction | RoaInvestDataReceiveAction;

export const receiveFetching = (fetching: boolean): RoaInvestDataFetchingReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_DATA_FETCHING_RECEIVE",
    payload: fetching,
});

export const receiveData = (data: RoaInvestData): RoaInvestDataReceiveAction => ({
    type: "COMPLIANCE_ROA_INVEST_DATA_RECEIVE",
    payload: data,
});
