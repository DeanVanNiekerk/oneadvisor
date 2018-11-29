// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import OrganisationForm from './OrganisationForm';
import { Drawer, DrawerFooter, Button, Loader } from '@/ui/controls';

import type { ReduxProps, RouterProps, ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { Organisation } from '@/state/app/directory/organisations/types';
import { getCachedOrganisation } from '@/state/app/directory/organisations/list/selectors';
import { organisationSelector } from '@/state/app/directory/organisations/organisation/selectors';
import {
    fetchOrganisation,
    updateOrganisation,
    insertOrganisation
} from '@/state/app/directory/organisations/organisation/actions';

type LocalProps = {
    visible: boolean,
    onClose: (cancelled: boolean) => void,
    organisation: Organisation,
    fetching: boolean,
    updating: boolean,
    error: boolean,
    validationResults: ValidationResult[]
};
type Props = LocalProps & RouterProps & ReduxProps;

type State = {
    organisationEdited: Organisation
};
class EditOrganisation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisationEdited: props.organisation
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.organisation != prevProps.organisation)
            this.setState({
                organisationEdited: this.props.organisation
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (this.state.organisationEdited.id) {
            this.props.dispatch(
                updateOrganisation(this.state.organisationEdited, this.close)
            );
        } else {
            this.props.dispatch(
                insertOrganisation(this.state.organisationEdited, this.close)
            );
        }
    };

    onChange = (organisation: Organisation) => {
        this.setState({
            organisationEdited: organisation
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    render() {
        const {
            organisation,
            validationResults,
            visible
        } = this.props;

        return (
            <Drawer
                title={`${organisation && organisation.id ? 'Edit' : 'New'} Organisation`}
                visible={visible}
                onClose={this.cancel}
            >
                <Loader isLoading={this.isLoading()}>
                    <OrganisationForm
                        organisation={organisation}
                        validationResults={validationResults}
                        onChange={this.onChange}
                    />
                </Loader>
                <DrawerFooter>
                    <Button onClick={this.cancel} disabled={this.isLoading()}>
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState, props: RouterProps) => ({
    organisation: organisationSelector(state).organisation,
    fetching: organisationSelector(state).fetching,
    updating: organisationSelector(state).updating,
    error: organisationSelector(state).error,
    validationResults: organisationSelector(state).validationResults
});

export default withRouter(connect(mapStateToProps)(EditOrganisation));
