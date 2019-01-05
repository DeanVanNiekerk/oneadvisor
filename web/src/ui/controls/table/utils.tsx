import { Icon } from 'antd';
import * as React from 'react';

import { ColumnSearch } from '@/ui/controls';

export const getColumnSearchProps = fieldName => {
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
            />
        ),
        filterIcon: filtered => (
            <Icon
                type="search"
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        )
    };
};
