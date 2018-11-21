// @flow

import React, { Component } from 'react';
import OrganisationForm from './OrganisationForm';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';

import { Loader, Error, Footer, Content, Header } from '@/ui/controls';

import type { ReduxProps, RouterProps, ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { Organisation } from '@/state/app/directory/organisations/types';
import { insertOrganisation } from '@/state/app/directory/organisations/organisation/actions';
import { organisationSelector } from '@/state/app/directory/organisations/organisation/selectors';

type LocalProps = {
    fetching: boolean,
    updating: boolean,
    error: boolean,
    validationResults: ValidationResult[]
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    organisation: Organisation
};
class NewOrganisation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        //Default new organisation values
        this.state = {
            organisation: {
                id: '',
                name: ''
            }
        };
    }

    back = () => {
        this.props.history.push(`/directory/organisations`);
    };

    save = () => {
        this.props.dispatch(insertOrganisation(this.state.organisation, this.back));
    };

    onChange = (organisation: Organisation) => {
        this.setState({
          organisation: organisation
        });
    };

    render() {

        if (this.props.error) return <Error />;

        return (
            <>
                <Header breadCrumb="New Organisation" />

                {this.props.updating && <Loader text="saving organisation..." />}

                {!this.props.updating && (
                    <>
                        <Content>
                            <OrganisationForm
                                organisation={this.state.organisation}
                                validationResults={this.props.validationResults}
                                onChange={this.onChange}
                            />
                        </Content>

                        <Footer>
                            <Button
                                color="secondary"
                                className="mr-1"
                                onClick={this.back}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={this.save}
                                disabled={this.props.updating}
                            >
                                {this.props.updating ? 'Saving...' : 'Save'}
                            </Button>
                        </Footer>
                    </>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: RootState, props: RouterProps) => ({
    updating: organisationSelector(state).updating,
    error: organisationSelector(state).error,
    validationResults: organisationSelector(state).validationResults
});

export default withRouter(connect(mapStateToProps)(NewOrganisation));
