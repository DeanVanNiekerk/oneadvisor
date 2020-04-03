import React, { useState } from "react";

import { Statement } from "@/state/commission/statements";
import { TabPane, Tabs } from "@/ui/controls";

import ExcelData from "./ExcelData";
import MappingDetails from "./MappingDetails";

type Props = {
    statement: Statement;
};

const MappingErrorForm: React.FC<Props> = (props: Props) => {
    const [activeTab, setActiveTab] = useState("form_tab");

    return (
        <>
            <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
                <TabPane tab="Mapping" key="form_tab">
                    <MappingDetails statement={props.statement} />
                </TabPane>

                <TabPane tab="Excel Data" key="data_tab">
                    <ExcelData />
                </TabPane>
            </Tabs>
        </>
    );
};

export default MappingErrorForm;
