import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { showConfirm } from '@/ui/feedback/modal/confirm';
import OrganisationForm from './OrganisationForm';
import { Drawer, DrawerFooter, Button, ContentLoader } from '@/ui/controls';

import { ValidationResult } from '@/state/types';
import { State as RootState } from '@/state/rootReducer';
import { Organisation } from '@/state/app/directory/organisations/types';
import { organisationSelector } from '@/state/app/directory/organisations/organisation/selectors';
import {
    updateOrganisation,
    insertOrganisation
} from '@/state/app/directory/organisations/organisation/actions';

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    organisation: Organisation | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & RouteComponentProps & DispatchProp

type State = {
    organisationEdited: Organisation | null;
};
class EditOrganisation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisationEdited: props.organisation
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.organisation != prevProps.organisation)
            this.setState({
                organisationEdited: this.props.organisation
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (this.props.organisation != this.state.organisationEdited)
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.organisationEdited) {
            this.close();
            return;
        }

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
        const { organisation, validationResults, visible } = this.props;

        return (
            <Drawer
                title={`${
                    organisation && organisation.id ? 'Edit' : 'New'
                } Organisation`}
                visible={visible}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {organisation && (
                        <OrganisationForm
                            organisation={organisation}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button
                        onClick={this.confirmCancel}
                        disabled={this.isLoading()}
                    >
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

const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);

    return {
        organisation: organisationState.organisation,
        fetching: organisationState.fetching,
        updating: organisationState.updating,
        validationResults: organisationState.validationResults
    };
};

export default withRouter(connect(mapStateToProps)(EditOrganisation));
