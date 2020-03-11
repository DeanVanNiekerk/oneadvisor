import { ColumnFilterItem } from "antd/lib/table/interface";

export const getBooleanOptions = (): ColumnFilterItem[] => {
    return [
        {
            value: "true",
            text: "Yes",
        },
        {
            value: "false",
            text: "No",
        },
    ];
};
