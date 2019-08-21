import { ColumnFilterItem } from "antd/lib/table";

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
}