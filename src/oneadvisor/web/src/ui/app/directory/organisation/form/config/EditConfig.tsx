import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { organisationIdSelector, organisationIsNew } from "@/state/directory/organisations";
import { TabPane, Tabs } from "@/ui/controls";

import CompaniesForm from "./CompaniesForm";
import ConfigTabTitle from "./ConfigTabTitle";
import DetailsForm from "./DetailsForm";

const EditConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} type="card">
            <TabPane
                tab={<ConfigTabTitle title="Details" validationPrefix="" exactMatch={true} />}
                key="details_tab"
            >
                <DetailsForm />
            </TabPane>
            <TabPane
                tab={
                    <ConfigTabTitle
                        title="Companies"
                        validationPrefix="CompanyIds"
                        exactMatch={true}
                    />
                }
                key="companies_tab"
            >
                <CompaniesForm />
            </TabPane>
        </Tabs>
    );
};

export default EditConfig;
