import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Result } from '@/app/types';
import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import { ClientEdit, clientSelector, insertClient, receiveClient, updateClient } from '@/state/app/client/clients';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import ClientForm from './ClientForm';

type Props = {
    onClose?: (cancelled: boolean) => void;
    onClientInserted?: (client: ClientEdit) => void;
    client: ClientEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
    visible: boolean;
} & DispatchProp;

type State = {
    clientEdited: ClientEdit | null;
};
class EditClient extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            clientEdited: props.client,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.client != prevProps.client) {
            this.setState({
                clientEdited: this.props.client,
            });
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receiveClient(null));
        if (this.props.onClose) this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.client, this.state.clientEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.clientEdited) {
            this.close();
            return;
        }

        if (this.state.clientEdited.id) {
            this.props.dispatch(
                updateClient(this.state.clientEdited, () => this.close())
            );
        } else {
            this.props.dispatch(
                insertClient(this.state.clientEdited, (result: Result) => {
                    if (this.props.onClientInserted)
                        this.props.onClientInserted(result.tag as ClientEdit);
                    this.close();
                })
            );
        }
    };

    onChange = (client: ClientEdit) => {
        this.setState({
            clientEdited: client,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Client";

        const { client } = this.props;

        if (client && client.id)
            return `Client: ${client.firstName || ""} ${client.lastName || ""}`;

        return "New Client";
    };

    render() {
        const { client, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="profile"
                visible={this.props.visible && !fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {client && (
                        <ClientForm
                            client={client}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button
                        onClick={this.confirmCancel}
                        disabled={this.isLoading()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                        requiredUseCase="clt_edit_clients"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientState = clientSelector(state);

    return {
        client: clientState.client,
        fetching: clientState.fetching,
        updating: clientState.updating,
        validationResults: clientState.validationResults,
    };
};

export default connect(mapStateToProps)(EditClient);
