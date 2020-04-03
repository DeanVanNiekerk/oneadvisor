import { Alert, Divider } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { ClientEdit, clientMergeSelector } from "@/state/client/clients";
import { RootState } from "@/state/rootReducer";
import { Button } from "@/ui/controls";

import ClientMergeSteps from "../ClientMergeSteps";

type Props = {
    insertedClient: ClientEdit;
} & DispatchProp &
    RouteComponentProps;

class Result extends Component<Props> {
    preview = () => {
        this.props.history.push(`/client/clients/${this.props.insertedClient.id}`);
    };

    render() {
        return (
            <>
                <ClientMergeSteps />

                <Divider />

                <Alert
                    message="Clients have been successfully merged."
                    type="success"
                    showIcon
                    className="mb-1"
                />

                <Button iconName="user" onClick={this.preview} type="primary" noLeftMargin={true}>
                    Preview Merged Client
                </Button>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = clientMergeSelector(state);

    return {
        insertedClient: mergeState.insertedClient,
    };
};

export default withRouter(connect(mapStateToProps)(Result));
