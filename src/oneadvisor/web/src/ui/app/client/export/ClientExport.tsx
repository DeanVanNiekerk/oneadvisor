import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { exportClientPolicies, exportClientPolicyAggregates } from "@/state/app/client/export";
import { Button, Header } from "@/ui/controls";

type State = {
    downloadingPolicies: boolean;
    downloadingPolicyAggregates: boolean;
};

class ClientExport extends Component<DispatchProp, State> {
    constructor(props) {
        super(props);

        this.state = {
            downloadingPolicies: false,
            downloadingPolicyAggregates: false,
        };
    }

    downloadClientPolicyAggregates = () => {
        this.setState({
            downloadingPolicyAggregates: true,
        });
        this.props.dispatch(
            exportClientPolicyAggregates(() => {
                this.setState({
                    downloadingPolicyAggregates: false,
                });
            })
        );
    };

    downloadClientPolicies = () => {
        this.setState({
            downloadingPolicies: true,
        });
        this.props.dispatch(
            exportClientPolicies(() => {
                this.setState({
                    downloadingPolicies: false,
                });
            })
        );
    };

    render() {
        return (
            <>
                <Header iconName="export">Export Client Data</Header>

                <div className="mt-1" />

                <Button
                    iconName="download"
                    loading={this.state.downloadingPolicyAggregates}
                    onClick={this.downloadClientPolicyAggregates}
                >
                    Policy Aggregates
                </Button>

                <Button
                    iconName="download"
                    loading={this.state.downloadingPolicies}
                    onClick={this.downloadClientPolicies}
                >
                    Policy Dump
                </Button>
            </>
        );
    }
}

export default connect()(ClientExport);
