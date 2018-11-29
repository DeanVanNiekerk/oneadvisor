// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Table, Header, Button } from '@/ui/controls';

import EditOrganisation from './EditOrganisation';

import { getColumn } from '@/state/utils';
import type { RouterProps, ReduxProps, PageOptions } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { Organisation } from '@/state/app/directory/organisations/types';
import { listSelector } from '@/state/app/directory/organisations/list/selectors';
import { fetchOrganisations } from '@/state/app/directory/organisations/list/actions';
import { fetchOrganisation, receiveOrganisation } from '@/state/app/directory/organisations/organisation/actions';

type LocalProps = {
    total: number,
    organisations: Organisation[],
    fetching: boolean,
    error: boolean,
    pageOptions: PageOptions
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    editVisible: boolean
};

class OrganisationList extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        this.loadOrganisations();
    }

    loadOrganisations = () => {
        this.props.dispatch(fetchOrganisations(this.props.pageOptions));
    };

    newOrganisation = id => {
        const organisation = {
            id: '',
            name: ''
        }
        this.props.dispatch(receiveOrganisation(organisation));
        this.setState({
            editVisible: true
        });
    };

    editOrganisation = id => {
        this.props.dispatch(fetchOrganisation(id));
        this.setState({
            editVisible: true
        });
    };

    closeEditOrganisation = (cancelled: boolean) => {
        console.log(cancelled);
        this.setState({
            editVisible: false
        });
        if(!cancelled)
            this.loadOrganisations();
    };

    getColumns = () => {
        return [getColumn('id', 'Id'), getColumn('name', 'Name')];
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <Button type="default" icon="plus" onClick={this.newOrganisation}>
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

const mapStateToProps = (state: RootState) => ({
    total: listSelector(state).totalItems,
    organisations: listSelector(state).items,
    fetching: listSelector(state).fetching,
    error: listSelector(state).error,
    pageOptions: listSelector(state).pageOptions
});

export default withRouter(connect(mapStateToProps)(OrganisationList));
