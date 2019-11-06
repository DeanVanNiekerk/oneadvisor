import update from "immutability-helper";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    insertOrganisation,
    OrganisationEdit,
    organisationSelector,
    updateOrganisation,
} from "@/state/app/directory/organisations";
import { userOrganisationIdSelector } from "@/state/auth";
import { fetchUserOrganisation } from "@/state/context/actions";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer, DrawerFooter, TabPane, Tabs } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import BranchList from "./BranchList";
import CompaniesForm from "./config/CompaniesForm";
import OrganisationForm from "./OrganisationForm";

type TabKey = "details_tab" | "branches_tab" | "companies_tab";

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    organisation: OrganisationEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
    organisationId: string;
} & DispatchProp;

type State = {
    organisationEdited: OrganisationEdit | null;
    activeTab: TabKey;
};
class EditOrganisation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            organisationEdited: props.organisation,
            activeTab: "details_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.organisation != prevProps.organisation)
            this.setState({
                organisationEdited: this.props.organisation,
                activeTab: "details_tab",
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.organisation, this.state.organisationEdited))
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
                updateOrganisation(this.state.organisationEdited, () => {
                    this.props.dispatch(fetchUserOrganisation(this.props.organisationId));
                    this.close();
                })
            );
        } else {
            this.props.dispatch(insertOrganisation(this.state.organisationEdited, this.close));
        }
    };

    onChange = (organisation: OrganisationEdit) => {
        this.setState({
            organisationEdited: organisation,
        });
    };

    onCompaniesChange = (companyIds: string[]) => {
        if (!this.state.organisationEdited) return;
        const organisation = update(this.state.organisationEdited, { config: { companyIds: { $set: companyIds } } });
        this.onChange(organisation);
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    isNew = () => {
        const { organisation } = this.props;
        return !(organisation && organisation.id);
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Organisation";

        const { organisation } = this.props;

        if (!this.isNew()) return `Organisation: ${organisation && organisation.name}`;

        return "New Organisation";
    };

    render() {
        const { organisation, validationResults, visible } = this.props;
        const { organisationEdited } = this.state;

        return (
            <Drawer
                title={this.getTitle()}
                icon="bank"
                visible={visible}
                onClose={this.confirmCancel}
                noTopPadding={true}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {organisation && organisationEdited && (
                        <Tabs onChange={this.onTabChange} activeKey={this.state.activeTab} sticky={true}>
                            <TabPane tab="Details" key="details_tab">
                                <OrganisationForm
                                    organisation={organisation}
                                    validationResults={validationResults}
                                    onChange={this.onChange}
                                />
                            </TabPane>
                            {!this.isNew() && (
                                <TabPane tab="Branches" key="branches_tab">
                                    <BranchList organisationId={organisation.id} />
                                </TabPane>
                            )}
                            <TabPane tab="Companies" key="companies_tab">
                                <CompaniesForm
                                    companyIds={organisationEdited.config.companyIds}
                                    onChange={this.onCompaniesChange}
                                />
                            </TabPane>
                        </Tabs>
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                        requiredUseCase="dir_edit_organisations"
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
        validationResults: organisationState.validationResults,
        organisationId: userOrganisationIdSelector(state),
    };
};

export default connect(mapStateToProps)(EditOrganisation);
