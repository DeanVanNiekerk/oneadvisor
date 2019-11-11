import { Icon } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";

import { ColumnSearch, DateRangeSearch } from "@/ui/controls";

function getColumnSearchProps<T>(title: string): ColumnProps<T> {
    let visible = false;

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <ColumnSearch
                title={title}
                setSelectedKeys={setSelectedKeys}
                selectedKeys={selectedKeys}
                confirm={confirm}
                clearFilters={clearFilters}
                visible={visible}
            />
        ),
        onFilterDropdownVisibleChange: v => {
            visible = v;
        },
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />,
    };
}

export { getColumnSearchProps };

function getDateRangeSearchProps<T>(): ColumnProps<T> {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <DateRangeSearch
                setSelectedKeys={setSelectedKeys || (() => {})}
                selectedKeys={selectedKeys || []}
                confirm={confirm || (() => {})}
                clearFilters={clearFilters || (() => {})}
            />
        ),
        filterIcon: filtered => (
            <Icon
                type="calendar"
                style={{
                    color: filtered ? "#1890ff" : "undefined",
                }}
            />
        ),
    };
}

export { getDateRangeSearchProps };
