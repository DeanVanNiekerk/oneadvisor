import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import CommissionDetails from "./CommissionDetails";
import CommissionSourceData from "./CommissionSourceData";

const CommissionForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Commission" key="details_tab">
                <CommissionDetails />
            </TabPane>
            <TabPane tab="Excel Data" key="data_tab">
                <CommissionSourceData />
            </TabPane>
        </Tabs>
    );
};

export default CommissionForm;
