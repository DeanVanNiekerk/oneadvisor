import { List } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Branch, branchesSelector, fetchBranch, fetchBranches, receiveBranch } from '@/state/app/directory/branches';
import { RootState } from '@/state/rootReducer';

import EditBranch from './EditBranch';

type Props = {
    organisationId: string;
    branches: Branch[];
    fetching: boolean;
    error: boolean;
} & DispatchProp;

class BranchList extends Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        this.loadBranches();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.organisationId !== this.props.organisationId)
            this.loadBranches();
    }

    loadBranches = () => {
        this.props.dispatch(receiveBranch(null));
        this.props.dispatch(fetchBranches(this.props.organisationId));
    };

    editBranch = (id: string) => {
        this.props.dispatch(fetchBranch(id));
    };

    render() {
        return (
            <>
                <EditBranch
                    onSave={this.loadBranches}
                    organisationId={this.props.organisationId}
                />
                <List
                    bordered
                    className="mt-1"
                    dataSource={this.props.branches}
                    loading={this.props.fetching}
                    renderItem={(branch: Branch) => (
                        <List.Item
                            actions={[
                                <a onClick={() => this.editBranch(branch.id)}>
                                    edit
                                </a>
                            ]}
                        >
                            {branch.name}
                        </List.Item>
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const branchesState = branchesSelector(state);

    return {
        branches: branchesState.items,
        fetching: branchesState.fetching,
        error: branchesState.error
    };
};

export default connect(mapStateToProps)(BranchList);
