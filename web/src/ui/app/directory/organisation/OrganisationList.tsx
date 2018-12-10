

import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Table, Header, Button } from '@/ui/controls';

import EditOrganisation from './EditOrganisation';

import { getColumn } from '@/state/utils';
import { State as RootState } from '@/state/rootReducer';
import { Organisation } from '@/state/app/directory/organisations/types';
import { listSelector } from '@/state/app/directory/organisations/list/selectors';
import { fetchOrganisations } from '@/state/app/directory/organisations/list/actions';
import { receiveOrganisation } from '@/state/app/directory/organisations/organisation/actions';

type Props = {
    total: number,
    organisations: Organisation[],
    fetching: boolean,
    error: boolean
} & DispatchProp;

type State = {
    editVisible: boolean
};

class OrganisationList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        if(this.props.organisations.length === 0)
            this.loadOrganisations();
    }

    loadOrganisations = () => {
        this.props.dispatch(fetchOrganisations());
    };

    newOrganisation = () => {
        const organisation = {
            id: '',
            name: ''
        }
        this.showEditOrganisation(organisation);
    };

    editOrganisation = (id: string) => {
        const organisation = this.props.organisations.find(u => u.id === id);
        if(organisation) this.showEditOrganisation(organisation);
    };

    showEditOrganisation = (organisation: Organisation) => {
        this.props.dispatch(receiveOrganisation(organisation));
        this.setState({
            editVisible: true
        });
    };

    closeEditOrganisation = (cancelled: boolean) => {
        this.setState({
            editVisible: false
        });
        if(!cancelled)
            this.loadOrganisations();
    };

    getColumns = () => {
        return [getColumn('name', 'Name')];
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <Button 
                            type="default" 
                            icon="plus" 
                            onClick={this.newOrganisation}
                            disabled={this.props.fetching}
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
                <EditOrganisation
                    visible={this.state.editVisible}
                    onClose={this.closeEditOrganisation}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    
    const organisationsState = listSelector(state);

    return {
        organisations: organisationsState.items,
        fetching: organisationsState.fetching,
        error: organisationsState.error
    }};

export default connect(mapStateToProps)(OrganisationList);