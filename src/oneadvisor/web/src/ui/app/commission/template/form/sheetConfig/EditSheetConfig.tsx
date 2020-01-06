import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import CommissionTypesForm from "./config/CommissionTypesForm";
import FieldsForm from "./config/FieldsForm";
import Groups from "./config/Groups";
import IdentifiersForms from "./config/IdentifiersForms";
import VATRatesForm from "./config/VATRatesForm";
import EditSheetConfigTabTitle from "./EditSheetConfigTabTitle";
import SheetSelector from "./SheetSelector";

const EditSheetConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState("config_identifiers");

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
                        title="Identifiers"
                        validationPrefix={["headerIdentifier", "amountIdentifier"]}
                    />
                }
                key="config_identifiers"
            >
                <IdentifiersForms />
            </TabPane>
            <TabPane
                tab={<EditSheetConfigTabTitle title="Fields" validationPrefix={["fields"]} />}
                key="config_fields"
            >
                <FieldsForm />
            </TabPane>
            <TabPane
                tab={
                    <EditSheetConfigTabTitle
                        title="Commission Types"
                        validationPrefix={["commissionTypes"]}
                    />
                }
                key="config_commission_types"
            >
                <CommissionTypesForm />
            </TabPane>
            <TabPane
                tab={<EditSheetConfigTabTitle title="Groups" validationPrefix={["groups"]} />}
                key="groups"
            >
                <Groups />
            </TabPane>
            <TabPane
                tab={<EditSheetConfigTabTitle title="VAT" validationPrefix={["vatRates"]} />}
                key="vatRates"
            >
                <VATRatesForm />
            </TabPane>
        </Tabs>
    );
};

export default EditSheetConfig;
