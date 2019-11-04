import { Icon } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";

import { ColumnSearch } from "@/ui/controls";

function getColumnSearchProps<T>(fieldName): ColumnProps<T> {
    let visible: boolean = false;

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <ColumnSearch
                fieldName={fieldName}
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
