import { Input } from "antd";
import React, { useEffect } from "react";

import { Button } from "../";

type Confirm = () => void;
type ClearFilters = (selectedKeys: string[]) => void;

type Props = {
    title: string;
    setSelectedKeys?: (selectedKeys: string[]) => void;
    selectedKeys?: React.ReactText[];
    confirm?: Confirm;
    clearFilters?: ClearFilters;
    visible: boolean;
};

const ColumnSearch: React.FC<Props> = (props: Props) => {
    let searchInput: Input | null;

    useEffect(() => {
        setTimeout(() => {
            if (searchInput) searchInput.select();
        });
    }, [props.visible]);

    const handleSearch = (confirm: Confirm | undefined) => {
        if (confirm) confirm();
    };

    const handleReset = (clearFilters: ClearFilters | undefined) => {
        if (clearFilters) clearFilters([]);
    };

    return (
        <div style={{ padding: 8 }}>
            <Input
                ref={(node) => {
                    searchInput = node;
                }}
                placeholder={`Search ${props.title}`}
                value={props.selectedKeys ? props.selectedKeys[0] : undefined}
                onChange={(e) => {
                    if (props.setSelectedKeys)
                        props.setSelectedKeys(e.target.value ? [e.target.value] : []);
                }}
                onPressEnter={() => handleSearch(props.confirm)}
                style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Button
                type="primary"
                onClick={() => handleSearch(props.confirm)}
                iconName="search"
                size="small"
                noLeftMargin={true}
                style={{ width: 90, marginRight: 8 }}
            >
                Search
            </Button>
            <Button
                onClick={() => handleReset(props.clearFilters)}
                size="small"
                noLeftMargin={true}
                style={{ width: 90 }}
            >
                Reset
            </Button>
        </div>
    );
};

export { ColumnSearch };
