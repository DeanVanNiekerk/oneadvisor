import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumnDefinition } from '@/app/table';
import { ROLE_SUPER_ADMIN } from '@/config/role';
import {
    fetchOrganisations, Organisation, organisationsSelector, receiveOrganisation
} from '@/state/app/directory/organisations';
import { RootState } from '@/state/rootReducer';
import { Button, getTable, Header } from '@/ui/controls';

import EditOrganisation from './EditOrganisation';

type Props = {
    organisations: Organisation[];
    fetching: boolean;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class OrganisationList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.organisations.length === 0) this.loadOrganisations();
    }

    loadOrganisations = () => {
        this.props.dispatch(fetchOrganisations());
    };

    newOrganisation = () => {
        const organisation = {
            id: "",
            name: "",
        };
        this.showEditOrganisation(organisation);
    };

    editOrganisation = (id: string) => {
        const organisation = this.props.organisations.find(u => u.id === id);
        if (organisation) this.showEditOrganisation(organisation);
    };

    showEditOrganisation = (organisation: Organisation) => {
        this.props.dispatch(receiveOrganisation(organisation));
        this.setState({
            editVisible: true,
        });
    };

    closeEditOrganisation = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadOrganisations();
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<Organisation>();
        return [getColumn("name", "Name")];
    };

    render() {
        const Table = getTable<Organisation>();
        return (
            <>
                <Header
                    icon="bank"
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newOrganisation}
                            disabled={this.props.fetching}
                            requiredUseCase="dir_edit_organisations"
                            requiredRole={ROLE_SUPER_ADMIN}
                        >
                            New Organisation
                        </Button>
                    }
                >
                    Organisations
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.organisations}
                    loading={this.props.fetching}
                    onRowClick={org => this.editOrganisation(org.id)}
                />
                <EditOrganisation visible={this.state.editVisible} onClose={this.closeEditOrganisation} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const organisationsState = organisationsSelector(state);

    return {
        organisations: organisationsState.items,
        fetching: organisationsState.fetching,
    };
};

export default connect(mapStateToProps)(OrganisationList);
