import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { userIsNew } from "@/state/directory/users";
import { TabPane, Tabs } from "@/ui/controls";

import AliasForm from "./AliasForm";
import Commission from "./Commission";
import DetailsForm from "./DetailsForm";
import Emails from "./Emails";
import RolesForm from "./RolesForm";

type Props = PropsFromState;

const OrganisationForm: React.FC<Props> = (props: Props) => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <DetailsForm />
            </TabPane>
            <TabPane tab="Roles" key="roles_tab">
                <RolesForm />
            </TabPane>
            <TabPane tab="Aliases" key="alias_tab">
                <AliasForm />
            </TabPane>
            {!props.isNew && (
                <TabPane tab="Email" key="emails_tab">
                    <Emails />
                </TabPane>
            )}
            {!props.isNew && (
                <TabPane tab="Commission" key="commission_tab">
                    <Commission />
                </TabPane>
            )}
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
