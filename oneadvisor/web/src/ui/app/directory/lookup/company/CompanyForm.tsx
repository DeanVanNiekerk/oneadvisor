import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import CompanyCommission from "./form/CompanyCommission";
import CompanyDetails from "./form/CompanyDetails";

const CompanyForm: React.FC = () => {

    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <CompanyDetails />
            </TabPane>
            <TabPane tab="Commission" key="commission_tab">
                <CompanyCommission />
            </TabPane>
        </Tabs>
    );
};

export default CompanyForm;



