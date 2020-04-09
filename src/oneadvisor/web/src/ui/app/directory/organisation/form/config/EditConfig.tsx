import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import AddressForm from "./AddressForm";
import CompaniesForm from "./CompaniesForm";
import ComplianceOfficerForm from "./ComplianceOfficerForm";
import ConfigTabTitle from "./ConfigTabTitle";
import DetailsForm from "./DetailsForm";
import LicenseCategoriesForm from "./LicenseCategoriesForm";

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
            <TabPane
                tab={
                    <ConfigTabTitle title="Address" validationPrefix="Address" exactMatch={false} />
                }
                key="address_tab"
            >
                <AddressForm />
            </TabPane>
            <TabPane
                tab={
                    <ConfigTabTitle
                        title="Compliance Officer"
                        validationPrefix="ComplianceOfficer"
                        exactMatch={false}
                    />
                }
                key="complianceOfficer_tab"
            >
                <ComplianceOfficerForm />
            </TabPane>
            <TabPane
                tab={
                    <ConfigTabTitle
                        title="License Categories"
                        validationPrefix="LicenseCategoryIds"
                        exactMatch={false}
                    />
                }
                key="license_categories_tab"
            >
                <LicenseCategoriesForm />
            </TabPane>
        </Tabs>
    );
};

export default EditConfig;
