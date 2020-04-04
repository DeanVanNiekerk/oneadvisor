import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { organisationIdSelector, organisationIsNew } from "@/state/directory/organisations";
import { TabPane, Tabs } from "@/ui/controls";

import BranchList from "./BranchList";
import ApplicationsForm from "./config/ApplicationsForm";
import CompaniesForm from "./config/CompaniesForm";
import OrganisationDetails from "./OrganisationDetails";

type Props = PropsFromState;

const OrganisationForm: React.FC<Props> = (props: Props) => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <OrganisationDetails />
            </TabPane>
            {!props.isNew && (
                <TabPane tab="Branches" key="branches_tab">
                    {props.organisationId && <BranchList organisationId={props.organisationId} />}
                </TabPane>
            )}
            <TabPane tab="Companies" key="companies_tab">
                <CompaniesForm />
            </TabPane>
            <TabPane tab="Applications" key="applications_tab">
                <ApplicationsForm />
            </TabPane>
        </Tabs>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        isNew: organisationIsNew(state),
        organisationId: organisationIdSelector(state),
    };
};

export default connect(mapStateToProps)(OrganisationForm);
