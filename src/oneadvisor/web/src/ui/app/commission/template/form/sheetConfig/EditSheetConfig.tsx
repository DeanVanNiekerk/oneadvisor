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

/*
constructor(props: Props) {
        super(props);

        this.state = {
            config: props.config,
            activeTab: "config_header_identifier",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.config != prevProps.config)
            this.setState({
                config: this.props.config,
            });
    }

    setConfigState = (config: SheetConfig) => {
        this.setState({
            config: config,
        });
        this.props.onChange(config);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    onHeaderIdentifierChange = (headerIdentifier: Identifier) => {
        const config = update(this.state.config, {
            headerIdentifier: {
                $set: headerIdentifier,
            },
        });
        this.setConfigState(config);
    };

    onFieldsChange = (fields: Field[]) => {
        const config = update(this.state.config, {
            fields: {
                $set: fields,
            },
        });
        this.setConfigState(config);
    };

    onGroupsChange = (groups: Group[]) => {
        const config = update(this.state.config, {
            groups: {
                $set: groups,
            },
        });
        this.setConfigState(config);
    };

    onCommissionTypesChange = (commissionTypes: CommissionTypes) => {
        const config = update(this.state.config, {
            commissionTypes: {
                $set: commissionTypes,
            },
        });
        this.setConfigState(config);
    };

    getHeaderIdentifierTabTitle = () => {
        return this.getTabTitle("Header Identifier", "headerIdentifier");
    };

    getFieldsTabTitle = () => {
        return this.getTabTitle("Fields", "fields");
    };

    getCommissionTypesTabTitle = () => {
        return this.getTabTitle("Commission Types", "commissionTypes");
    };

    getGroupsTabTitle = () => {
        return this.getTabTitle("Groups", "groups");
    };

    getTabTitle = (title: string, prefix: string) => {
        const count = getValidationSubSet(prefix, this.props.validationResults).length;
        return (
            <Badge count={count} offset={[10, -2]}>
                {title}
            </Badge>
        );
    };
*/

export default EditSheetConfig;
