import { Button, DatePicker } from "antd";
import { RangePickerValue } from "antd/lib/date-picker/interface";
import moment from "moment";
import * as React from "react";

const { RangePicker } = DatePicker;

type Props = {
    setSelectedKeys: (selectedKeys: string[]) => void;
    selectedKeys: React.ReactText[];
    confirm: () => void;
    clearFilters: (selectedKeys: string[]) => void;
};

const DateRangeSearch: React.FC<Props> = (props: Props) => {
    const getMomentValues = (): RangePickerValue => {
        if (!props.selectedKeys || props.selectedKeys.length !== 2) return [];

        return [moment(props.selectedKeys[0]), moment(props.selectedKeys[1])];
    };

    return (
        <div className="custom-filter-dropdown">
            <RangePicker
                onChange={(dates: RangePickerValue, dateStrings: [string, string]) => {
                    props.setSelectedKeys(dateStrings);
                }}
                style={{
                    marginBottom: 8,
                    display: "block",
                }}
                value={getMomentValues()}
            />
            <Button
                type="primary"
                onClick={() => props.confirm()}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
            >
                Search
            </Button>
            <Button onClick={() => props.clearFilters([])} size="small" style={{ width: 90 }}>
                Reset
            </Button>
        </div>
    );
};

export { DateRangeSearch };
