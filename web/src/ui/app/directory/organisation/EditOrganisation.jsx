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
import { getCachedOrganisation } from '@/state/app/directory/organisations/list/selectors';
import { organisationSelector } from '@/state/app/directory/organisations/organisation/selectors';
import {
    fetchOrganisation,
    updateOrganisation
} from '@/state/app/directory/organisations/organisation/actions';

type LocalProps = {
    organisation: Organisation,
    fetching: boolean,
    updating: boolean,
    error: boolean,
    validationResults: ValidationResult[]
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    organisationEdited: ?Organisation
};
class EditOrganisation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisationEdited: null
        };
    }

    componentDidMount() {
        if (!this.props.organisation)
            this.props.dispatch(fetchOrganisation(this.props.match.params.organisationId));
    }

    back = () => {
        this.props.history.push(`/directory/organisations`);
    };

    save = () => {
        if (this.state.organisationEdited)
            this.props.dispatch(updateOrganisation(this.state.organisationEdited, this.back));
        else this.back();
    };

    onChange = (organisation: Organisation) => {
        this.setState({
            organisationEdited: organisation
        });
    };

    canSave = () => {
        return this.state.organisationEdited !== null && !this.props.updating;
    };

    isLoading = () => {
        return this.props.fetching 
                || !this.props.organisation;
    };

    render() {
        if (this.props.error) return <Error />;

        return (
            <>
                <Header breadCrumb="Edit Organisation" />

                {this.isLoading() && <Loader text="loading organisation..." />}

                {!this.isLoading() && (
                    <>
                        <Content>
                            <OrganisationForm
                                organisation={this.props.organisation}
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
    organisation: getCachedOrganisation(state, props) || organisationSelector(state).organisation,
    fetching: organisationSelector(state).fetching,
    updating: organisationSelector(state).updating,
    error: organisationSelector(state).error,
    validationResults: organisationSelector(state).validationResults
});

export default withRouter(connect(mapStateToProps)(EditOrganisation));
