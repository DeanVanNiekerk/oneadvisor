import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { hasUseCase } from '@/app/identity';
import { ClientPreview, clientPreviewSelector, fetchClient, fetchClientPreview } from '@/state/app/client/clients';
import { newPolicy, receivePolicy } from '@/state/app/client/policies';
import { ClientTypeId } from '@/state/app/directory/lookups/clientTypes';
import { useCaseSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import {
    Age, Button, ClientTypeIcon, Drawer, DrawerFooter, Header, PreviewCard, PreviewCardContainer, PreviewCardRow
} from '@/ui/controls';

import ContactList from '../contact/ContactList';
import EditPolicy from '../policy/EditPolicy';
import PolicyList from '../policy/PolicyList';
import EditClient from './EditClient';

type Props = {
    client: ClientPreview | null;
    fetching: boolean;
    useCases: string[];
} & RouteComponentProps<{ clientId: string }> &
    DispatchProp;

type State = {
    policyListVisible: boolean;
    contactListVisible: boolean;
    clientEditVisible: boolean;
};

class ClientPreviewComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyListVisible: false,
            contactListVisible: false,
            clientEditVisible: false,
        };
    }

    componentDidMount() {
        this.load();
    }

    toggleClientEditVisible = () => {
        this.setState({
            clientEditVisible: !this.state.clientEditVisible,
        });
    };

    togglePolicyListVisible = () => {
        this.setState({
            policyListVisible: !this.state.policyListVisible,
        });
    };

    toggleContactListVisible = () => {
        this.setState({
            contactListVisible: !this.state.contactListVisible,
        });
    };

    newPolicy = () => {
        const policy = newPolicy({
            clientId: this.getClientId(),
        });
        this.props.dispatch(receivePolicy(policy));
    };

    getClientId = () => {
        return this.props.match.params.clientId;
    };

    load = () => {
        this.props.dispatch(fetchClientPreview(this.getClientId()));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.load();
    };

    editDetails = () => {
        this.props.dispatch(fetchClient(this.getClientId()));
        this.toggleClientEditVisible();
    };

    closeClientEdit = (cancelled: boolean) => {
        this.onFormClose(cancelled);
        this.toggleClientEditVisible();
    };

    isLoading = () => {
        return this.props.fetching && this.props.client === null;
    };

    getPolicyActions = () => {
        const actions = [
            <Icon type="bars" onClick={this.togglePolicyListVisible} />,
        ];

        if (hasUseCase("clt_edit_policies", this.props.useCases))
            actions.unshift(
                <Icon
                    type="plus"
                    onClick={e => {
                        e.stopPropagation();
                        this.newPolicy();
                    }}
                />
            );

        return actions;
    };

    back = () => {
        return this.props.history.push("/client");
    };

    render() {
        let { client } = this.props;
        const cardHeight = "100px";

        let icon = <span />;
        if (client) {
            icon = <ClientTypeIcon clientTypeId={client.clientTypeId} />;
        }

        return (
            <>
                <Header
                    icon={icon}
                    loading={this.isLoading()}
                    onBack={this.back}
                >
                    {`${client && client.lastName}${
                        client && client.firstName ? ", " : ""
                    } ${client && (client.firstName || "")}`}
                </Header>

                <PreviewCardContainer>
                    <PreviewCard
                        title="Details"
                        icon="profile"
                        onClick={this.editDetails}
                        isLoading={this.isLoading()}
                        actions={[
                            <Icon type="edit" onClick={this.editDetails} />,
                        ]}
                        rows={2}
                        height={cardHeight}
                    >
                        {client && (
                            <>
                                {client.clientTypeId ===
                                    ClientTypeId.Individual && (
                                    <>
                                        <PreviewCardRow
                                            label="Id"
                                            value={`${
                                                client.idNumber
                                                    ? client.idNumber
                                                    : ""
                                            }`}
                                        />
                                        <PreviewCardRow
                                            label="Age"
                                            value={
                                                <Age
                                                    dateOfBirth={
                                                        client.dateOfBirth
                                                    }
                                                />
                                            }
                                        />
                                    </>
                                )}
                                {client.clientTypeId !==
                                    ClientTypeId.Individual && (
                                    <>
                                        <PreviewCardRow
                                            label="Reg. Number"
                                            value={`${
                                                client.alternateIdNumber
                                                    ? client.alternateIdNumber
                                                    : ""
                                            }`}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Policies"
                        icon="file-text"
                        onClick={this.togglePolicyListVisible}
                        isLoading={this.isLoading()}
                        requiredUseCase="clt_view_policies"
                        actions={this.getPolicyActions()}
                        height={cardHeight}
                    >
                        {client && (
                            <>
                                <PreviewCardRow
                                    label="Policies"
                                    value={`${client.policyCount}`}
                                />
                                <PreviewCardRow
                                    label=""
                                    value={<span>&nbsp;</span>}
                                />
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Contacts"
                        icon="phone"
                        onClick={this.toggleContactListVisible}
                        isLoading={this.isLoading()}
                        requiredUseCase="clt_view_contacts"
                        actions={[
                            <Icon
                                type="bars"
                                onClick={this.toggleContactListVisible}
                            />,
                        ]}
                        height={cardHeight}
                    >
                        {client && (
                            <>
                                <PreviewCardRow
                                    label="Contacts"
                                    value={`${client.contactCount}`}
                                />
                                <PreviewCardRow
                                    label=""
                                    value={<span>&nbsp;</span>}
                                />
                            </>
                        )}
                    </PreviewCard>
                </PreviewCardContainer>

                <EditClient
                    onClose={this.closeClientEdit}
                    visible={this.state.clientEditVisible}
                />
                <EditPolicy onClose={this.onFormClose} />

                <Drawer
                    title="Policies"
                    icon="file-text"
                    noTopPadding={true}
                    visible={this.state.policyListVisible}
                    onClose={this.togglePolicyListVisible}
                >
                    <PolicyList
                        clientId={this.getClientId()}
                        onChange={this.load}
                    />
                    <DrawerFooter>
                        <Button onClick={this.togglePolicyListVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>

                <Drawer
                    title="Contacts"
                    icon="phone"
                    noTopPadding={true}
                    visible={this.state.contactListVisible}
                    onClose={this.toggleContactListVisible}
                >
                    <ContactList
                        clientId={this.getClientId()}
                        onSave={this.load}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleContactListVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientState = clientPreviewSelector(state);

    return {
        client: clientState.client,
        fetching: clientState.fetching,
        useCases: useCaseSelector(state),
    };
};

export default withRouter(connect(mapStateToProps)(ClientPreviewComponent));
