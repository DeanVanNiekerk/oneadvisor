import { Button, Input } from 'antd';
import * as React from 'react';

type Props = {
    fieldName: string;
    setSelectedKeys: (keys: string[]) => void;
    selectedKeys: string[];
    confirm: () => void;
    clearFilters: () => void;
};

type State = {
    searchText: string;
};

class ColumnSearch extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            searchText: ''
        };
    }

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        return (
            <div className="custom-filter-dropdown">
                <Input
                    ref={node => {
                        //@ts-ignore
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${this.props.fieldName}`}
                    value={this.props.selectedKeys[0]}
                    onChange={e =>
                        this.props.setSelectedKeys(
                            e.target.value ? [e.target.value] : []
                        )
                    }
                    onPressEnter={() =>
                        this.handleSearch(
                            this.props.selectedKeys,
                            this.props.confirm
                        )
                    }
                    style={{
                        width: 188,
                        marginBottom: 8,
                        display: 'block'
                    }}
                />
                <Button
                    type="primary"
                    onClick={() =>
                        this.handleSearch(
                            this.props.selectedKeys,
                            this.props.confirm
                        )
                    }
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(this.props.clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        );
    }
}

export { ColumnSearch };
