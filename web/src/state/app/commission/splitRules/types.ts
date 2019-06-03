export type SplitRule = {
    id: string;
    userId: string;
    name: string;
    isDefault: boolean;
    split: Split[];
};

export type Split = {
    userId: string;
    percentage: number;
};
