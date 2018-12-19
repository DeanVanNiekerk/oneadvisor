import { Icon } from 'antd';
import * as React from 'react';
import { ColumnSearch } from '@/ui/controls';

export const getColumnSearchProps = fieldName => ({
    filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
    }) => (
        <ColumnSearch
            fieldName={fieldName}
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
        />
    ),
    filterIcon: filtered => (
        <Icon
            type="search"
            style={{ color: filtered ? '#1890ff' : undefined }}
        />
    )
    // onFilter: (value, record) =>
    //     record[dataIndex]
    //         .toString()
    //         .toLowerCase()
    //         .includes(value.toLowerCase()),
    // onFilterDropdownVisibleChange: visible => {
    //     if (visible) {
    //         setTimeout(() => this.searchInput.select());
    //     }
    // },
    // render: text => (
    //     <Highlighter
    //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //         searchWords={[this.state.searchText]}
    //         autoEscape
    //         textToHighlight={text.toString()}
    //     />
    // )
});
