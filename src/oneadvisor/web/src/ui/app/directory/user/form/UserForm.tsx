import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { userIsNew } from "@/state/directory/users";
import { TabPane, Tabs } from "@/ui/controls";

import DetailsForm from "./DetailsForm";

type Props = PropsFromState;

const OrganisationForm: React.FC<Props> = (props: Props) => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <DetailsForm />
            </TabPane>
            {/* {!props.isNew && (
                <TabPane tab="Branches" key="branches_tab">
                    {props.organisationId && <BranchList organisationId={props.organisationId} />}
                </TabPane>
            )}
            <TabPane
                tab={
                    <OrganisationTabTitle
                        title="Applications"
                        validationPrefix="ApplicationIds"
                        exactMatch={true}
                    />
                }
                key="applications_tab"
            >
                <ApplicationsForm />
            </TabPane>
            <TabPane
                tab={
                    <OrganisationTabTitle
                        title="Config"
                        validationPrefix="Config"
                        exactMatch={false}
                    />
                }
                key="config_tab"
            >
                <EditConfig />
            </TabPane> */}
        </Tabs>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        isNew: userIsNew(state),
    };
};

export default connect(mapStateToProps)(OrganisationForm);
