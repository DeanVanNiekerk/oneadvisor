import { DatePicker } from "antd";
import moment from "moment";
import * as React from "react";

import { Button } from "../";

const { RangePicker } = DatePicker;

type Props = {
    setSelectedKeys?: (selectedKeys: string[]) => void;
    selectedKeys: React.ReactText[];
    confirm?: () => void;
    clearFilters?: (selectedKeys: string[]) => void;
};

const DateRangeSearch: React.FC<Props> = (props: Props) => {
    const getMomentValues = (): [moment.Moment, moment.Moment] => {
        if (!props.selectedKeys || props.selectedKeys.length !== 2) undefined;

        return [moment(props.selectedKeys[0]), moment(props.selectedKeys[1])];
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
                value={getMomentValues()}
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
