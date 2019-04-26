import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ClientEdit, getClient } from '@/state/app/client/clients';

type Props = {
    clientId: string | null;
    className?: string;
    prefix?: string;
} & DispatchProp;

type State = {
    client: ClientEdit | null;
};

class ClientNameComponent extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { client: null };
        this.loadClient();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.clientId != prevProps.clientId) this.loadClient();
    }

    loadClient = () => {
        if (!this.props.clientId) {
            this.setState({ client: null });
            return;
        }

        this.props.dispatch(
            getClient(this.props.clientId, (client: ClientEdit) => {
                this.setState({ client: client });
            })
        );
    };

    render() {
        const { client } = this.state;

        if (!client) return <span />;

        return (
            <span className={this.props.className}>{`${this.props.prefix ||
                ""}${client.firstName || ""} ${client.lastName || ""}`}</span>
        );
    }
}

const ClientName = connect()(ClientNameComponent);

export { ClientName };
