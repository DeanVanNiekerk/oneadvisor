// @flow

import React, { Component } from 'react';
import UserForm from './UserForm';
import { withRouter } from 'react-router';

import { Content, Footer } from '@/ui/layout/main';
import { Button } from '@/ui/common/controls';

type Props = {
    history: Object
};

class EditUser extends Component<Props> {
    cancel = () => {
        this.props.history.push(`/directory/users`);
        console.log('cancel')
    };

    render() {
        return (
            <Content>
                <h4>Edit User</h4>
                <UserForm user={{ firstName: 'Dean' }} />
                <Footer>
                    <Button color="default" onClick={() => this.cancel()}>
                        Cancel
                    </Button>
                    <Button color="primary">Save</Button>
                </Footer>
            </Content>
        );
    }
}

export default withRouter(EditUser);
