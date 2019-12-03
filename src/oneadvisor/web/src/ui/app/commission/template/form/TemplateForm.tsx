import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import TemplateDetails from "./details/TemplateDetails";
import RawConfig from "./rawConfig/RawConfig";
import EditSheetConfig from "./sheetConfig/EditSheetConfig";
import SheetList from "./sheetList/SheetList";
import TemplateTabTitle from "./TemplateTabTitle";

const TemplateForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <TemplateDetails />
            </TabPane>
            <TabPane
                tab={
                    <TemplateTabTitle
                        title="Sheet"
                        validationPrefix="config.sheets"
                        exactMatch={true}
                    />
                }
                key="sheets"
            >
                <SheetList />
            </TabPane>

            <TabPane
                tab={
                    <TemplateTabTitle
                        title="Config"
                        validationPrefix="config.sheets"
                        exactMatch={false}
                    />
                }
                key="sheet_config"
            >
                <EditSheetConfig />
            </TabPane>
            <TabPane tab="Raw Config" key="config_raw">
                <RawConfig />
            </TabPane>
        </Tabs>
    );
};

export default TemplateForm;
