// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';

import {
    Table
} from '@/ui/controls';

import type { RouterProps, ReduxProps, PageOptions } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import { listSelector } from '@/state/app/directory/organisations/list/selectors';
import {
    fetchOrganisations,
    receivePageNumber
} from '@/state/app/directory/organisations/list/actions';
import type { Organisation } from '@/state/app/directory/organisations/types';

type LocalProps = {
    total: number,
    organisations: Organisation[],
    fetching: boolean,
    error: boolean,
    pageOptions: PageOptions
};
type Props = LocalProps & RouterProps & ReduxProps;

class OrganisationList extends Component<Props> {

    componentDidMount() {
        this.loadOrganisations();
    }

    loadOrganisations = () => {
        this.props.dispatch(fetchOrganisations(this.props.pageOptions));
    };

    editOrganisation = id => {
        this.props.history.push(`/directory/organisations/${id}`);
    };

    newOrganisation = () => {
        this.props.history.push(`/directory/organisations/new`);
    };

    // onPageChange = pageNumber => {
    //     this.props.dispatch(receivePageNumber(pageNumber));
    // };

    componentDidUpdate(prevProps: LocalProps) {
        //Page number has changed, reload
        if (this.props.pageOptions != prevProps.pageOptions) {
            this.loadOrganisations();
        }
    }

    getColumns = () => {
        return [
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                sorter: true
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: true
            }
        ];
    };

    render() {
        //if (this.props.error) return <Error />;

        return (

            <Table 
                dataSource={this.props.organisations} 
                columns={this.getColumns()} 
                loading={this.props.fetching}
            />

            // <>
                
            //     <Header>
            //         <Button
            //             color="light"
            //             outline
            //             onClick={this.newOrganisation}
            //             size="sm"
            //         >
            //             New Organisation
            //         </Button>
            //     </Header> 

            //      {this.props.fetching && <Loader text="loading organisations..." />}

            //     {!this.props.fetching && (
            //         <>
            //             <Content>
            //                 <table className="table">
            //                     <thead>
            //                         <tr>
            //                             <th>Id</th>
            //                             <th>Name</th>
            //                         </tr>
            //                     </thead>
            //                     <tbody>
            //                         {this.props.organisations.map(organisation => (
            //                             <tr
            //                                 key={organisation.id}
            //                                 onClick={() =>
            //                                     this.editOrganisation(organisation.id)
            //                                 }
            //                             >
            //                                 <td>{organisation.id}</td>
            //                                 <td>{organisation.name}</td>
            //                             </tr>
            //                         ))}
            //                     </tbody>
            //                 </table>
            //             </Content>

            //             <Footer>
            //                 <Pagination
            //                     pageNumber={this.props.pageOptions.number}
            //                     pageSize={this.props.pageOptions.size}
            //                     totalItems={this.props.total}
            //                     onChange={this.onPageChange}
            //                  />
            //             </Footer>
            //         </>
            //     )} 
            // </>
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
