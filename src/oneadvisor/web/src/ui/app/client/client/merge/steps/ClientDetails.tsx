import { Alert, Divider } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";
import {
    clientMergeNextStep,
    clientMergePreviousStep,
    clientMergeSelector,
    clientSelector,
    mergeClients,
    receiveClient,
    receiveSelectedClients,
} from "@/state/client/clients";
import { Client, ClientEdit, MergeClients } from "@/state/client/clients/types";
import { MergeCellsOutlined } from "@ant-design/icons";

import ClientForm from "../../form/ClientForm";
import ClientMergeSteps from "../ClientMergeSteps";

type Props = {
    client: ClientEdit | null;
    clients: Client[];
    validationResults: ValidationResult[];
} & DispatchProp;

class ClientDetails extends Component<Props> {
    componentDidMount() {
        const client = this.mergeClients(this.props.clients);
        this.props.dispatch(receiveClient(client));
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.clients != prevProps.clients) {
            const client = this.mergeClients(this.props.clients);
            this.props.dispatch(receiveClient(client));
        }
    }

    mergeClients = (clients: Client[]): ClientEdit => {
        const client: ClientEdit = {
            ...clients[0],
        };
        clients.forEach((m) => {
            for (const property in m) {
                const value = m[property];
                if (value != undefined && value != null && value != "") client[property] = value;
            }
        });
        client.id = null;
        return client;
    };

    save = () => {
        if (!this.props.client) return;

        const merge: MergeClients = {
            targetClient: this.props.client,
            sourceClientIds: this.props.clients.map((m) => m.id),
        };

        this.props.dispatch(
            mergeClients(
                merge,
                //Success
                () => {
                    this.props.dispatch(receiveSelectedClients([]));
                    this.props.dispatch(clientMergeNextStep());
                }
            )
        );
    };

    render() {
        return (
            <>
                <ClientMergeSteps
                    onNext={() => this.save()}
                    nextIcon={<MergeCellsOutlined />}
                    nextText="Merge"
                    onPrevious={() => this.props.dispatch(clientMergePreviousStep())}
                />

                <Divider />

                <Alert
                    message="Before merging, please confirm that you are happy with the merged client details."
                    type="info"
                    showIcon
                    className="mb-1"
                />

                {this.props.client && <ClientForm />}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = clientMergeSelector(state);
    const clientState = clientSelector(state);

    return {
        clients: mergeState.clients,
        client: clientState.client,
        validationResults: clientState.validationResults,
    };
};

export default connect(mapStateToProps)(ClientDetails);
