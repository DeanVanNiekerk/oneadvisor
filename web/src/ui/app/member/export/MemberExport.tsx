import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { exportMemberPolicies, exportMemberPolicyAggregates } from '@/state/app/member/export';
import { Button, Header } from '@/ui/controls';

type State = {
    downloadingPolicies: boolean;
    downloadingPolicyAggregates: boolean;
};

class MemberExport extends Component<DispatchProp, State> {
    constructor(props) {
        super(props);

        this.state = {
            downloadingPolicies: false,
            downloadingPolicyAggregates: false,
        };
    }

    downloadMemberPolicyAggregates = () => {
        this.setState({
            downloadingPolicyAggregates: true,
        });
        this.props.dispatch(
            exportMemberPolicyAggregates(() => {
                this.setState({
                    downloadingPolicyAggregates: false,
                });
            })
        );
    };

    downloadMemberPolicies = () => {
        this.setState({
            downloadingPolicies: true,
        });
        this.props.dispatch(
            exportMemberPolicies(() => {
                this.setState({
                    downloadingPolicies: false,
                });
            })
        );
    };

    render() {
        return (
            <>
                <Header icon="download">Export Member Data</Header>

                <div className="mt-1" />

                <Button
                    icon="download"
                    loading={this.state.downloadingPolicyAggregates}
                    onClick={this.downloadMemberPolicyAggregates}
                >
                    Policy Aggregates
                </Button>

                <Button
                    icon="download"
                    loading={this.state.downloadingPolicies}
                    onClick={this.downloadMemberPolicies}
                >
                    Policies
                </Button>
            </>
        );
    }
}

export default connect()(MemberExport);
