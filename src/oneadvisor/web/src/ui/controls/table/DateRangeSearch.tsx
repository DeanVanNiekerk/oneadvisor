import generatePicker from "antd/es/date-picker/generatePicker";
import dayjs, { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import React from "react";

import { Button } from "../";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

const { RangePicker } = DatePicker;

type Props = {
    setSelectedKeys?: (selectedKeys: string[]) => void;
    selectedKeys: React.ReactText[];
    confirm?: () => void;
    clearFilters?: (selectedKeys: string[]) => void;
};

const DateRangeSearch: React.FC<Props> = (props: Props) => {
    const getDayjsValues = (): [Dayjs, Dayjs] => {
        if (!props.selectedKeys || props.selectedKeys.length !== 2) undefined;

        return [dayjs(props.selectedKeys[0]), dayjs(props.selectedKeys[1])];
    };

    return (
        <div style={{ padding: 8, width: 270 }}>
            <RangePicker
                onChange={(_dates: never, dateStrings: [string, string]) => {
                    if (props.setSelectedKeys) props.setSelectedKeys(dateStrings);
                }}
                style={{
                    marginBottom: 8,
                }}
                value={getDayjsValues()}
            />
            <Button
                type="primary"
                onClick={() => {
                    if (props.confirm) props.confirm();
                }}
                iconName="search"
                noLeftMargin={true}
                size="small"
                style={{ width: 123, marginRight: 8 }}
            >
                Search
            </Button>
            <Button
                onClick={() => {
                    if (props.clearFilters) props.clearFilters([]);
                }}
                size="small"
                noLeftMargin={true}
                style={{ width: 123 }}
            >
                Reset
            </Button>
        </div>
    );
};

export { DateRangeSearch };
