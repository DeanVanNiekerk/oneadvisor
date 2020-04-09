import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import AdviceScopesForm from "./AdviceScopesForm";
import ConfigTabTitle from "./ConfigTabTitle";

const EditConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState("advice_scopes_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} type="card">
            <TabPane
                tab={
                    <ConfigTabTitle
                        title="Advice Scopes"
                        validationPrefix="AdviceScopeIds"
                        exactMatch={false}
                    />
                }
                key="advice_scopes_tab"
            >
                <AdviceScopesForm />
            </TabPane>
        </Tabs>
    );
};

export default EditConfig;
