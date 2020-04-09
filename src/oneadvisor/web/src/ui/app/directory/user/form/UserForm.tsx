import React, { useState } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { RootState } from "@/state";
import { useCaseSelector } from "@/state/auth";
import { userIsNew } from "@/state/directory/users";
import { TabPane, Tabs } from "@/ui/controls";

import AliasForm from "./AliasForm";
import Commission from "./Commission";
import EditConfig from "./config/EditConfig";
import DetailsForm from "./DetailsForm";
import Emails from "./Emails";
import RolesForm from "./RolesForm";
import UserTabTitle from "./UserTabTitle";

type Props = PropsFromState;

const OrganisationForm: React.FC<Props> = (props: Props) => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <DetailsForm />
            </TabPane>
            <TabPane
                tab={<UserTabTitle title="Roles" validationPrefix="Roles" exactMatch={false} />}
                key="roles_tab"
            >
                <RolesForm />
            </TabPane>
            <TabPane
                tab={<UserTabTitle title="Aliases" validationPrefix="Aliases" exactMatch={false} />}
                key="alias_tab"
            >
                <AliasForm />
            </TabPane>
            {!props.isNew && (
                <TabPane tab="Email" key="emails_tab">
                    <Emails />
                </TabPane>
            )}
            {!props.isNew && hasUseCase("com_view_commission_split_rules", props.useCases) && (
                <TabPane tab="Commission" key="commission_tab">
                    <Commission />
                </TabPane>
            )}
            <TabPane
                tab={<UserTabTitle title="Config" validationPrefix="Config" exactMatch={false} />}
                key="config_tab"
            >
                <EditConfig />
            </TabPane>
        </Tabs>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        isNew: userIsNew(state),
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(OrganisationForm);
