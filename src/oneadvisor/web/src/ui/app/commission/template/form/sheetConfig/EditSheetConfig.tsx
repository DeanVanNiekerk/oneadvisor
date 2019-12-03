import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import CommissionTypesForm from "./config/CommissionTypesForm";
import FieldsForm from "./config/FieldsForm";
import Groups from "./config/Groups";
import HeaderIdentifierForm from "./config/HeaderIdentifierForm";
import EditSheetConfigTabTitle from "./EditSheetConfigTabTitle";
import SheetSelector from "./SheetSelector";

const EditSheetConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState("config_header_identifier");

    return (
        <Tabs
            onChange={setActiveTab}
            activeKey={activeTab}
            sticky={true}
            tabBarExtraContent={<SheetSelector />}
            type="card"
        >
            <TabPane
                tab={
                    <EditSheetConfigTabTitle
                        title="Header Identifier"
                        validationPrefix="headerIdentifier"
                    />
                }
                key="config_header_identifier"
            >
                <HeaderIdentifierForm />
            </TabPane>
            <TabPane
                tab={<EditSheetConfigTabTitle title="Fields" validationPrefix="fields" />}
                key="config_fields"
            >
                <FieldsForm />
            </TabPane>
            <TabPane
                tab={
                    <EditSheetConfigTabTitle
                        title="Commission Types"
                        validationPrefix="commissionTypes"
                    />
                }
                key="config_commission_types"
            >
                <CommissionTypesForm />
            </TabPane>
            <TabPane
                tab={<EditSheetConfigTabTitle title="Groups" validationPrefix="groups" />}
                key="groups"
            >
                <Groups />
            </TabPane>
        </Tabs>
    );
};

export default EditSheetConfig;
