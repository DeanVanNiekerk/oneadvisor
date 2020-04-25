export type RoaInvestDataState = {
    readonly fetching: boolean;
    readonly data: RoaInvestData;
};

export type RoaInvestData = {
    readonly clientFullName: string;
    readonly consultReason: string;
};
