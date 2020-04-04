import { Alert, Divider, List } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getAge } from "@/app/utils";
import { RootState } from "@/state";
import {
    Client,
    clientMergeNextStep,
    clientMergeSelector,
    getAlternateIdNumberLabel,
} from "@/state/client/clients";

import ClientMergeSteps from "../ClientMergeSteps";

type Props = {
    clients: Client[];
} & DispatchProp;

class SourceClients extends Component<Props> {
    clientFullName = (client: Client): string => {
        const parts: string[] = [];

        if (client.lastName) parts.push(client.lastName);

        if (client.firstName) parts.push(client.firstName);

        if (client.initials) parts.push(client.initials);

        return parts.join(",");
    };

    clientDetails = (client: Client): string => {
        const parts: string[] = [];

        if (client.dateOfBirth) parts.push(`Age: ${getAge(client.dateOfBirth)}`);

        if (client.idNumber) parts.push(`ID Number: ${client.idNumber}`);
        else if (client.alternateIdNumber)
            parts.push(
                `${getAlternateIdNumberLabel(client.clientTypeId)}: ${client.alternateIdNumber}`
            );

        return parts.join(" | ");
    };

    render() {
        return (
            <>
                <ClientMergeSteps onNext={() => this.props.dispatch(clientMergeNextStep())} />

                <Divider />

                <Alert
                    message="Before continuing, please confirm that you do wish to merge all the clients below."
                    type="info"
                    showIcon
                    className="mb-1"
                />

                <List
                    itemLayout="horizontal"
                    bordered={true}
                    dataSource={this.props.clients}
                    renderItem={(client: Client) => (
                        <List.Item>
                            <List.Item.Meta
                                title={this.clientFullName(client)}
                                description={this.clientDetails(client)}
                            />
                        </List.Item>
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = clientMergeSelector(state);

    return {
        clients: mergeState.clients,
    };
};

export default connect(mapStateToProps)(SourceClients);
