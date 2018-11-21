// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Pagination, PaginationItem, PaginationLink, Button } from 'reactstrap';

import { Loader, Error, Content, Footer, Header } from '@/ui/controls';

import type { RouterProps, ReduxProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import { listSelector } from '@/state/app/directory/users/list/selectors';
import { fetchUsers } from '@/state/app/directory/users/list/actions';
import type { User } from '@/state/app/directory/users/types';

type LocalProps = {
    users: User[],
    fetching: boolean,
    error: boolean
};
type Props = LocalProps & RouterProps & ReduxProps;

class UserList extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(fetchUsers());
    }

    editUser = id => {
        this.props.history.push(`/directory/users/${id}`);
    };

    newUser = () => {
        this.props.history.push(`/directory/users/new`);
    };

    render() {
        if (this.props.error) return <Error />;

        return (
            <>
                <Header>
                    <Button
                        color="light"
                        outline
                        onClick={this.newUser}
                        size="sm"
                    >
                        New User
                    </Button>
                </Header>

                {this.props.fetching && <Loader text="loading users..." />}

                {!this.props.fetching && (
                    <>
                        <Content>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.users.map(user => (
                                        <tr
                                            key={user.id}
                                            onClick={() =>
                                                this.editUser(user.id)
                                            }
                                        >
                                            <td>{user.id}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
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
    users: listSelector(state).items || [],
    fetching: listSelector(state).fetching,
    error: listSelector(state).error
});

export default withRouter(connect(mapStateToProps)(UserList));
