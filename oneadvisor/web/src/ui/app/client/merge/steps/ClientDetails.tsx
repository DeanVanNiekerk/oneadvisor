import { Alert, Divider } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { ValidationResult } from "@/app/validation";
import {
    Client, ClientEdit, clientMergeNextStep, clientMergePreviousStep, clientMergeSelector, clientSelector, MergeClients,
    mergeClients, receiveClient, receiveSelectedClients
} from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";

import ClientForm from "../../client/form/ClientForm";
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

    mergeClients = (clients: Client[]): Client => {
        const client = {
            ...clients[0],
        };
        clients.forEach(m => {
            for (let property in m) {
                const value = m[property];
                if (value != undefined && value != null && value != "") client[property] = value;
            }
        });
        client.id = "";
        return client;
    };

    save = () => {

        if (!this.props.client) return;

        var merge: MergeClients = {
            targetClient: this.props.client,
            sourceClientIds: this.props.clients.map(m => m.id),
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
                    nextIcon="fork"
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

                {this.props.client && (
                    <ClientForm />
                )}
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
