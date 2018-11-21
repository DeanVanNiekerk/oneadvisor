// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Pagination, PaginationItem, PaginationLink, Button } from 'reactstrap';

import { Loader, Error, Content, Footer, Header } from '@/ui/controls';

import type { RouterProps, ReduxProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import { listSelector } from '@/state/app/directory/organisations/list/selectors';
import { fetchOrganisations } from '@/state/app/directory/organisations/list/actions';
import type { Organisation } from '@/state/app/directory/organisations/types';

type LocalProps = {
    organisations: Organisation[],
    fetching: boolean,
    error: boolean
};
type Props = LocalProps & RouterProps & ReduxProps;

class OrganisationList extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(fetchOrganisations());
    }

    editOrganisation = id => {
        this.props.history.push(`/directory/organisations/${id}`);
    };

    newOrganisation = () => {
        this.props.history.push(`/directory/organisations/new`);
    };

    render() {
        if (this.props.error) return <Error />;

        return (
            <>
                <Header>
                    <Button
                        color="light"
                        outline
                        onClick={this.newOrganisation}
                        size="sm"
                    >
                        New Organisation
                    </Button>
                </Header>

                {this.props.fetching && <Loader text="loading organisations..." />}

                {!this.props.fetching && (
                    <>
                        <Content>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.organisations.map(organisation => (
                                        <tr
                                            key={organisation.id}
                                            onClick={() =>
                                                this.editOrganisation(organisation.id)
                                            }
                                        >
                                            <td>{organisation.id}</td>
                                            <td>{organisation.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Content>

                        <Footer>
                            <Pagination size="sm" listClassName="m-0">
                                <PaginationItem disabled>
                                    <PaginationLink previous href="#" />
                                </PaginationItem>
                                <PaginationItem active>
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">2</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">4</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">5</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink next href="#" />
                                </PaginationItem>
                            </Pagination>
                        </Footer>
                    </>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    organisations: listSelector(state).items || [],
    fetching: listSelector(state).fetching,
    error: listSelector(state).error
});

export default withRouter(connect(mapStateToProps)(OrganisationList));
