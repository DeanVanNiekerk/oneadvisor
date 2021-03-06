import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import PolicyDetails from "./PolicyDetails";
import PolicyNumberAliases from "./PolicyNumberAliases";
import PolicyTabTitle from "./PolicyTabTitle";

const PolicyForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane
                tab={
                    <PolicyTabTitle
                        title="Details"
                        validationPrefix={["Number", "Premium", "StartDate"]}
                        exactMatch={true}
                    />
                }
                key="details_tab"
            >
                <PolicyDetails />
            </TabPane>
            <TabPane
                tab={
                    <PolicyTabTitle
                        title="Aliases"
                        validationPrefix={["NumberAliases"]}
                        exactMatch={false}
                    />
                }
                key="aliases_tab"
            >
                <PolicyNumberAliases />
            </TabPane>
        </Tabs>
    );
};

export default PolicyForm;
