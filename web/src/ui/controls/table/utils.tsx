import { Icon } from 'antd';
import * as React from 'react';

//import Highlighter from 'react-highlight-words';
import { ColumnSearch } from '@/ui/controls';

export const getColumnSearchProps = fieldName => {
    let searchText = '';

    return {
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
                // onSearchChange={(text: string) => {
                //     searchText = text;
                // }}
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
        //         searchWords={[searchText]}
        //         autoEscape
        //         textToHighlight={text.toString()}
        //     />
        // )
    };
};
